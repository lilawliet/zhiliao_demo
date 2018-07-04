import random
# pip install Pillow
from PIL import Image, ImageDraw, ImageFont
import time
import os
import string

# Captcha 验证码
class Captcha(object):
    font_path = os.path.join(os.path.dirname(__file__), 'Verdana.ttf')  # os.path.dirname(__file__) 获取当前文件所在目录
    # 生成验证码位数
    number = 4
    # 生成验证码宽度高度
    size = (100, 40)
    # 背影颜色
    bgcolor = (0, 0, 0)
    # 随机数颜色
    random.seed(int(time.time()))
    fontcolor = (random.randint(100, 255), random.randint(100, 255), random.randint(100, 255))
    fontsize = 20
    # 干扰线颜色
    linecolor = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    # 是否加入干扰线
    draw_line = True
    # 是否绘制干扰点
    draw_point = True
    # 加入干扰线数量
    line_number = 3

    SOURCE = list(string.ascii_letters)  # 返回a—z A-Z 的字符组成的列表
    for index in range(0, 10):
        SOURCE.append(str(index))   # 得到 a—z A-Z 0-9 的字符组成的列表

    @classmethod
    def gene_text(cls):
        return ''.join(random.sample(cls.SOURCE, cls.number))  # sample方法，对SOURCE随机取 cls.number 数量的样本

    # 绘制干扰线
    @classmethod
    def __gene_line(cls, draw, width, height):
        begin = (random.randint(0, width), random.randint(0, height))
        end = (random.randint(0, width), random.randint(0, height))
        draw.line([begin, end], fill = cls.linecolor)

    # 绘制干扰点
    @classmethod
    def __gene_points(cls, draw, point_chance, width, height):
        chance = min(100, max(0, int(point_chance)))  # 大小限制在 [0, 100]
        for w in range(width):
            for h in range(height):
                tmp = random.randint(0, 100)
                if tmp > 100 - chance:
                    draw.point((w, h), fill=(0, 0, 0))

    # 生成验证码
    @classmethod
    def gene_code(cls):
        width, height = cls.size
        image = Image.new('RGBA', (width, height), cls.bgcolor)  # 创建画板
        font = ImageFont.truetype(cls.font_path, cls.fontsize)
        draw = ImageDraw.Draw(image)  # 创建画笔
        text = cls.gene_text()  # 生成字符串
        font_width, font_height = font.getsize(text)
        draw.text(((width - font_width) / 2, (height - font_height) / 2), text, font=font, fill=cls.fontcolor)  # 填充字符串
        # 如果需要绘制干扰线
        if cls.draw_line:
            for x in range(0, cls.line_number):
                cls.__gene_line(draw, width, height)

        # 如果需要绘制干扰点
        if cls.draw_point:
            cls.__gene_points(draw, 10, width, height)

        return (text, image)





