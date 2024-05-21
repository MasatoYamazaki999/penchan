
def chk(inp, ans):
    cnt = [0,0]
    for i, d in enumerate(ans):
        for i2, d2 in enumerate(inp):
            if d == d2:
                if i == i2: 
                    cnt[0] += 1
                else:
                    cnt[1] += 1
    return cnt