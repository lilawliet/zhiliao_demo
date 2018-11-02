from utlis import restful
from django.shortcuts import redirect


def my_login_required(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        else:
            if request.is_ajax():
                return restful.params_error(message='请登录！')
            else:
                return redirect('/')
    return wrapper
