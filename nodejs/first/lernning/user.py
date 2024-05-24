import itertools
import HandB

# 9*8*7*6の数値順列作成(3072個)
hb_list = list(itertools.permutations(range(1, 10), 4))

ans_tpl = (9, 8, 7, 6)

while True:
    inp_str = input("enter:")
    result = []
    # 入力文字列を数値タプルにする。
    # ex: '1234' -> (1, 2, 3, 4)

    inp_tpl = tuple([int(s) for s in inp_str])

    print("入力:", inp_tpl)
    hit = HandB.hit(inp_tpl, ans_tpl)
    blow = HandB.blow(inp_tpl, ans_tpl)
    print("hit:", hit, "blow:", blow)
    for t in hb_list:
        h = HandB.hit(inp_tpl, t)
        b = HandB.blow(inp_tpl, t)
        if hit == h and blow == b:
            result.append(t)
    if True or True or True:
        print("hehehe")

    print("適合個数:", len(result))
    print("対象", result)
    hb_list = result
    if len(result) == 1:
        print("おめでとう")
        break
