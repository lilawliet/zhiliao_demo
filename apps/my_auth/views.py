from django.contrib.auth import login, logout, authenticate, get_user_model  # authenticate 授权
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegistForm
from utlis import restful, captcha
from utlis.aliyunsdk import aliyunsms
from django.shortcuts import redirect, reverse, render
from io import BytesIO
from django.http import HttpResponse
from django.core.cache import cache

User = get_user_model()


# 不能使用 login 作为函数名
@require_POST
def my_login(request):
    form = LoginForm(request.POST)

    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        print(user)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)  # 设置成浏览器默认过期时间（两周）
                else:
                    request.session.set_expiry(0)  # 关闭浏览器清除session
                return restful.result()
            else:
                return restful.unauth(message='该账号已被冻结！')
        else:
            return restful.params_error(message='用户名或密码错误！')
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


@require_POST
def my_register(request):
    form = RegistForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())


# 不能使用 logout 作为函数名
def my_logout(request):
    logout(request)
    return redirect(reverse('index'))


def img_captchar(request):
    text, image = captcha.Captcha.gene_code()
    # BytesIO: 相当于一个管道， 用来存储图片的流数据
    out = BytesIO()
    # 调用image的save方法， 将image对象保存到BytesIO中
    image.save(out, 'png')
    # 将BytesIO的指针移动到起始位置
    out.seek(0)

    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    response['Content-length'] = out.tell()  # 指针位置就是content的length

    # 将验证码存入 memcached
    cache.set(text.lower(), text.lower(), 5*60)

    return response


def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = captcha.Captcha.gene_text()

    # 将验证码存入 memcached
    cache.set(telephone, code, 5*60)
    print('code:{}'.format(code))
    # result = aliyunsms.send_sms(code=code, phone_numbers=telephone)
    return restful.ok()


def cache_test(request):
    cache.set('username', 'hpw', 60)
    result = cache.get('username')
    print(result)
    return HttpResponse('1')

