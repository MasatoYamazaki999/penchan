import random    # ランダムモジュールをインポート

class HB:    # ヒットアンドブローのクラス
    def __init__(self, ans, num, times):
        self.ans = str(ans)
        self.num = str(num)
        self.times = times

    def hit(self):    # hit関数で、ヒット数をカウント
        hits = 0
        for i in range(0, 4):
            if self.ans[i] == self.num[i]:
                hits += 1
        print(str(hits) + "H", end="")
        if hits == 4:   # ヒット数が4になったらクリア
            return print(f"\nおめでとうございます！ あなたは{self.times}手でクリアしました！")

    def blow(self):    # blow関数でblow数をカウント
        blows = 0
        for l1 in range(0, 4):
            for l2 in range(0, 4):
                if l1 != l2:
                    if self.ans[l1] == self.num[l2]:
                        blows += 1
        return print(str(blows) + "B")


a = random.randint(1, 8)    # 0から始まることがなく、かつ、どの桁も重複しない4桁の整数を生成
ints_list = [str(a)]
one_to_ten = [i for i in range(9)]
del one_to_ten[a]
random.shuffle(one_to_ten)
for i in range(3):
    ints_list.append(str(one_to_ten[i]))
ints = "".join(ints_list)
ints = int(ints)


t = 0    # 無限ループして代入
while True:
    try:
        t += 1
        hb = HB(ints, int(input(">>>")), t)
        hb.hit()
        hb.blow()
    except:
        print("エラー：4桁の数字を正しく入力してください")
