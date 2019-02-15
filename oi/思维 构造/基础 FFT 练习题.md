# 基础 FFT 练习题
[LOJ6487]

给定两个长度都为$n$的正整数数组a​1​​,a​2​​,...,a​n​​,b​1​​,b​2​​,...,b​n​​，求
$$\sum _ {i=1}^{n} \sum _ {j=1}^{n} \lfloor \sqrt{|a _ {i}-b _ {j}|} \rfloor$$

其中 $\lfloor \rfloor$ 表示下取整。

注意到数据范围有$\sum A[i] \le 10^6,\sum B[i] \le 10^6$，所以可以分别排序，然后对$A$统计每一种数的出现次数，对$B$的同种数一起计算。预处理出开根。  
需要常数优化。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxNum=1000010;
const int inf=2147483647;

int n;
int Sqrt[maxNum];
int A[maxN],B[maxN];
int numcnt,Num[maxN],Cnt[maxN];

namespace IO{
    const int maxn((1 << 21) + 1);

    char ibuf[maxn], *iS, *iT, obuf[maxn], *oS = obuf, *oT = obuf + maxn - 1, c, st[55];
    int f, tp;
    char Getc() {
        return (iS == iT ? (iT = (iS = ibuf) + fread(ibuf, 1, maxn, stdin), (iS == iT ? EOF : *iS++)) : *iS++);
    }

    void Flush() {
        fwrite(obuf, 1, oS - obuf, stdout);
        oS = obuf;
    }

    void Putc(char x) {
        *oS++ = x;
        if (oS == oT) Flush();
    }
    
    template <class Int> void Input(Int &x) {
        for (f = 1, c = Getc(); c < '0' || c > '9'; c = Getc()) f = c == '-' ? -1 : 1;
        for (x = 0; c <= '9' && c >= '0'; c = Getc()) x = (x << 3) + (x << 1) + (c ^ 48);
        x *= f;
    }
    
    template <class Int> void Print(Int x) {
        if (!x) Putc('0');
        if (x < 0) Putc('-'), x = -x;
        while (x) st[++tp] = x % 10 + '0', x /= 10;
        while (tp) Putc(st[tp--]);
    }

    void Getstr(char *s, int &l) {
        for (c = Getc(); c < 'a' || c > 'z'; c = Getc());
        for (l = 0; c <= 'z' && c >= 'a'; c = Getc()) s[l++] = c;
        s[l] = 0;
    }
    
    void Putstr(const char *s) {
        for (int i = 0, n = strlen(s); i < n; ++i) Putc(s[i]);
    }
}

using namespace IO;

int main(){
	int i,j,k,TTT,tot;
	ll Ans;
	for (i=1,j=1;i<maxNum;++i){
		while (1ll*(j+1)*(j+1)<=i) ++j;
		Sqrt[i]=j;
	}
	Input(TTT);
	while (TTT--){
		Input(n);
		for (i=1;i<=n;++i) Input(A[i]);
		for (i=1;i<=n;++i) Input(B[i]);
		sort(&A[1],&A[n+1]);sort(&B[1],&B[n+1]);
		numcnt=0;
		for (i=1,j;i<=n;i=j+1){
			j=i;
			while ((j<n)&&(A[j+1]==A[i])) ++j;
			Num[++numcnt]=A[i];Cnt[numcnt]=j-i+1;
		}

		Ans=0;
		for (i=1,j;i<=n;i=j+1){
			j=i;
			while ((j<n)&&(B[j+1]==B[i])) ++j;
			tot=j-i+1;
			for (k=1;k<=numcnt;++k)
				if (B[i]>=Num[k]) Ans=Ans+1ll*Sqrt[B[i]-Num[k]]*Cnt[k]*tot;
				else Ans=Ans+1ll*Sqrt[Num[k]-B[i]]*Cnt[k]*tot;
		}

		Print(Ans);Putc('\n');
	}
	Flush();

	return 0;
}s
```