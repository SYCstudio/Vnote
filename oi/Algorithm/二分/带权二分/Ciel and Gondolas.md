# Ciel and Gondolas
[CF321E BZOJ5311]

Ciel狐狸在游乐园里排队等待上摩天轮。现在有 $n$ 个人在队列里，有 $k$ 条船，第i条船到时，前 $q _ {i}$ 个人可以上船。最后一条船将载走剩下的所有人，则 $q _ {k}$ 此时载走的人数。  
人总是不愿意和陌生人上同一条船的，当第 $i$ 个人与第 $j$ 个人处于同一条船上时，会产生 $u _ {i,j}$ 的沮丧值。请你求出最小的沮丧值和。  
一条船上的人两两都会产生沮丧值。

设 $F[i][k]$ 表示前 $i$ 个人分成 $k$ 组的方案，把后面一维二分掉，然后就变成了一维的 $DP$ 。直接转移的复杂度是 $O(n)$ 的，发现转移具有单调性，即如果这一次从后一个转移过来更优，则前面的转移一定不会出现了。那么每次加入一个状态的时候与之前的进行比较，如果发现后面的已经一定更优了，则直接替换；否则，找到临界点，临界点前后分别计算。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define RG register
#define IL inline

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

const int maxN=4010;
const int inf=2147483647;

class QueueData
{
public:
	int id,l,r;
};

int n,K;
int Val[maxN][maxN],Sum[maxN][maxN];
int F[maxN],G[maxN];
QueueData Q[maxN];

void Calc(RG int C);
IL bool Better(RG int u,RG int v,RG int tim);
IL int Beyond(RG int u,RG int v);

int main(){
	RG int i,j,L,R,pos,mid;
	Input(n);Input(K);
	for (i=1;i<=n;++i) for (j=1;j<=n;++j) Input(Val[i][j]);
	for (j=1;j<=n;++j) for (i=j-1;i>=1;--i) Val[i][j]+=Val[i+1][j];
	for (i=1;i<=n;++i) for (j=i;j<=n;++j) Sum[i][j]=Sum[i][j-1]+Val[i][j];

	L=0;R=Sum[1][n];pos;
	do{
		mid=(L+R)>>1;
		Calc(mid);
		if (G[n]>=K) pos=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);
	Calc(pos);
	IO::Print(F[n]-K*pos);
	IO::Flush();
	return 0;
}

void Calc(RG int C){
	RG int L=1,R=1,i,pos;Q[1]=((QueueData){0,0,n});
	for (i=1;i<=n;++i){
		++Q[L].l;if (Q[L].l>Q[L].r) ++L;
		F[i]=F[Q[L].id]+Sum[Q[L].id+1][i]+C;G[i]=G[Q[L].id]+1;
		if ((L>R)||(Better(i,Q[R].id,n))){
			while ((L<=R)&&(Better(i,Q[R].id,Q[R].l))) --R;
			if (L>R) Q[++R]=((QueueData){i,i,n});
			else{
				pos=Beyond(i,Q[R].id);
				Q[R].r=pos-1;Q[++R]=((QueueData){i,pos,n});
			}
		}
	}
	return;
}

IL bool Better(RG int u,RG int v,RG int tim){
	RG int key1=F[u]+Sum[u+1][tim],key2=F[v]+Sum[v+1][tim];
	return ((key1<key2)||((key1==key2)&&(G[u]>=G[v])));
}

IL int Beyond(RG int u,RG int v){
	RG int L=v,R=n,ret=0,mid;
	do{
		mid=(L+R)>>1;
		if (Better(u,v,mid)) ret=mid,R=mid-1;
		else L=mid+1;
	}
	while (L<=R);
	return ret;
}
```