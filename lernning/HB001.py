import random
import mod_hb.hb_check as hb_check

anser=random.sample("123456789", 4)
ans = ''.join(anser)

times = 0
while True:
    try:
#        print("ans: ", ans)
        inp = input(">>>Anser(End:e)>>>")
        if inp == 'e':
            break
        if len(inp) != 4:
            continue
        if inp.isdecimal() == False:
            continue
        r = list(inp)
        if '0' in r:
            continue
        times += 1

        res = hb_check.chk(inp, ans)
        print(res)
        if res[0] == 4:
            print(f'\n{times} 回で、あたり！')
            break
    except Exception as e:
        print(e, "エラー:4桁の数字を正しく入力してください")

