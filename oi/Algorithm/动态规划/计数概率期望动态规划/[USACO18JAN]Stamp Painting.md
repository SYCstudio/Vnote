# [USACO18JAN]Stamp Painting
[BZOJ5190 Luogu4187]

Bessie想拿$M$ 种颜色的长为$K$ 的图章涂一个长为$N$ 的迷之画布。假设他选择涂一段区间，则这段区间长度必须为$K$ ，且涂完后该区间颜色全变成图章颜色。他可以随便涂，但是最后必须把画布画满。问能有多少种最终状态，$N\leq 10^6,M\leq 10^6,K\leq 10^6$ 

可以发现，只要有一个长度至少为 K 的颜色相同的块，就一定存在一种方案构造出这种解。那么问题变成求至少存在一个长度大于等于 K 的同色块的方案数。直接求不好求，考虑其补集——不包含长度为 K 的同色段的方案数。设 F[i] 表示长度为 i 时的方案数，则当 i<K 时 F[i]=F[i-1]*m ，i >= K 时 $F[i]=\sum _ {j=1} ^ {K-1} (m-1)F[i-j]$ ，前缀和优化转移。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,K;
int F[maxN],Sum[maxN];

int QPow(int x,int cnt);

int main(){
	scanf("%d%d%d",&n,&m,&K);
	F[0]=1;
	for (int i=1;i<K;i++) F[i]=1ll*F[i-1]*m%Mod,Sum[i]=(Sum[i-1]+F[i])%Mod;
	for (int i=K;i<=n;i++) F[i]=1ll*(Sum[i-1]-Sum[i-K]+Mod)%Mod*(m-1)%Mod,Sum[i]=(Sum[i-1]+F[i])%Mod;
	printf("%d\n",(QPow(m,n)-F[n]+Mod)%Mod);return 0;
}

int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}
```