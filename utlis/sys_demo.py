import sys

# sys.argv, 运行时接收到的参数组成的列表，如果下标越界则报错
# print('script name is', sys.argv[0], 'second argv is', sys.argv[1])

# sys.builtin_module_names, python 内建模块
# for module in sys.builtin_module_names:
#     print(module)

# sys.path, python 搜索模块（库）的路径集
# for path in sys.path:
#     print(path)

# sys.modules, python 已导入的模块
# print(sys.modules.keys())

# sys.platform, 获取当前使用平台
# print('当前使用平台为', sys.platform)

"""
标准输入和标准错误 (通常缩写为 stdout 和 stderr) 是内建在每一个 UNIX 系统中的管道。
当你 print 某些东西时，结果前往 stdout 管道；
当你的程序崩溃并打印出调试信息 (例如 Python 中的 traceback (错误跟踪)) 的时候，信息前往 stderr 管道
"""

"""
stdout 是一个类文件对象；调用它的 write 函数可以打印出你给定的任何字符串。
实际上，这就是 print 函数真正做的事情；它在你打印的字符串后面加上一个硬回车，然后调用 sys.stdout.write 函数。
在最简单的例子中，stdout 和 stderr 把它们的输出发送到相同的地方
和 stdout 一样，stderr 并不为你添加硬回车；如果需要，要自己加上。
stdout 和 stderr 都是类文件对象，但是它们都是只写的。
它们都没有 read 方法，只有 write 方法。然而，它们仍然是类文件对象，因此你可以将其它任何 (类) 文件对象赋值给它们来重定向其输出。
"""

# 重定向输出
# print('标准输出')  # 标准输出
# saveout = sys.stdout  # 终在重定向前保存stdout，这样的话之后你还可以将其设回正常
# fsock = open('out.log', 'w')  # 打开一个新文件用于写入。如果文件不存在，将会被创建。如果文件存在，将被覆盖。
# sys.stdout = fsock  # 所有后续的输出都会被重定向到刚才打开的新文件上
# print('重定向输出的内容')
# sys.stdout = saveout   # 在我们将 stdout 搞乱之前，让我们把它设回原来的方式。
# fsock.close()  # 关闭日志文件。

# 重定向错误信息
esock = open('error.log', 'w')  # 打开你要存储调试信息的日志文件。
sys.stderr = esock  # 将新打开的日志文件的文件对象赋值给stderr以重定向标准错误。
# raise Exception('this error will be logged')  # 引发一个异常,没有在屏幕上打印出任何东西,所有正常的跟踪信息已经写进error.log
# print('调用sys.sterr', sys.stderr)

# 打印到stderr
print('error message', file=sys.stderr)

# sys 模块退出程序,引发SystemExit异常，这意味着可以捕获该异常
# sys.exit(1)


# sys.exitfunc 可以设置捕获 sys.exit 异常 时调用的方法
def exitfunc():
    print('exitfunc')


sys.exitfunc = exitfunc
sys.exit(1)


