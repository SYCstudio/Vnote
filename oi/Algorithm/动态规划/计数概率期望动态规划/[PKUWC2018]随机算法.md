# [PKUWC2018]随机算法
[LOJ2540]

我们知道，求任意图的最大独立集是一类NP完全问题，目前还没有准确的多项式算法，但是有许多多项式复杂度的近似算法。  
例如，小 C 常用的一种算法是：  
1. 对于一个 $n$ 个点的无向图，先等概率随机一个 $1\ldots n$ 的排列 $p[1\ldots n]$。  
2. 维护答案集合 $S$ ，一开始 $S$ 为空集，之后按照 $i=1\ldots n$ 的顺序，检查 $\{p[i]\}\cup S$ 是否是一个独立集，如果是的话就令 $S=\{p[i]\}\cup S$。  
3. 最后得到一个独立集 $S$ 作为答案。  
小 C 现在想知道，对于给定的一张图，这个算法的正确率，输出答案对 $998244353$ 取模

设 F[S] 表示 S 集合内的点不能再被选择，即 S 中的点全部在排列中出现时，能形成最大独立集的概率。枚举排列的最后一个元素，从该集合减去与枚举的这个元素及相邻的所有元素的集合转移过来。由于要求的是最大独立集，同时再记录一个 mx[S] 表示 S 的最大独立集大小，转移的时候实时更新，如果更新成功就要把原来的答案清空，只累计上这一次的答案。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1<<20;
const int Mod=998244353;

int n,m;
int F[maxN],Mx[maxN],Nr[maxN];

int QPow(int x,int cnt);

int main(){
	scanf("%d%d",&n,&m);int N=1<<n;
	for (int i=1;i<=m;i++){
		int u,v;scanf("%d%d",&u,&v);--u;--v;
		Nr[u]|=(1<<v);Nr[v]|=(1<<u);
	}
	for (int i=0;i<n;i++) Nr[i]|=(1<<i);
	F[0]=1;
	for (int S=1;S<N;S++){
		int cnt=0;
		for (int i=0;i<n;i++)
			if (S&(1<<i)){
				int nS=(S|Nr[i])^Nr[i];++cnt;
				if (Mx[nS]+1>Mx[S]) Mx[S]=Mx[nS]+1,F[S]=0;
				if (Mx[nS]+1==Mx[S]) F[S]=(F[S]+F[nS])%Mod;
			}
		F[S]=1ll*F[S]*QPow(cnt,Mod-2)%Mod;
	}
	printf("%d\n",F[N-1]);return 0;
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