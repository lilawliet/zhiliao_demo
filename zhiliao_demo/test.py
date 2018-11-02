# A0 = dict(zip(('a','b','c','d','e'),(1,2,3,4,5)))
# A1 = range(10)
# A2 = [i for i in A1 if i in A0]
# A3 = [A0[s] for s in A0]
#
#
# print(A3)
# import this

import sys
# print('script name is', sys.argv[0], 'second argv is', sys.argv[1])
# for i in sys.path:
#     print(i)
for module in sys.builtin_module_names:
    print(module)
