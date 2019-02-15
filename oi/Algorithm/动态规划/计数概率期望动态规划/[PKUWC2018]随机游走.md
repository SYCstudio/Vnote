# [PKUWC2018]随机游走
[LOJ2542]

给定一棵 $n$ 个结点的树，你从点 $x$ 出发，每次等概率随机选择一条与所在点相邻的边走过去。  
有 $Q$ 次询问，每次询问给定一个集合 $S$，求如果从 $x$ 出发一直随机游走，直到点集 $S$ 中所有点都至少经过一次的话，期望游走几步。  
特别地，点 $x$（即起点）视为一开始就被经过了一次。  
答案对 $998244353 $ 取模。

先无脑列出方程，设 $F[u][S]$ 表示从 u 出发，经过点集 S 的期望步数，$D[u]$ 为点 u 的度数，那么有：
当 $u \in S$ 时，此时需要讨论两种情况，一是 $\\{u\\}=S$，此时 $F[u][S]=0$ ；否则，枚举每一条边，有转移 $F[u][S]=\frac{\sum _ {u-v} F[v][S-\\{u\\}]}{D[u]}+1$  
当 $u \notin S$ 时，此时就只有一种情况了，即 $F[u][S]=\frac{\sum _ {u-v}F[v][S]}{D[u]}+1$  
观察到后一个方程是在同层转移的，也就是说需要高斯消元。  
但是注意到这是在树上，根据树上高斯消元的一半套路，设 $F[u]=A[u] F[fa[u]]+B[u]$，那么可以先自底向上推出系数，再自上而下得到值，这样复杂度就降下来了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=18;
const int maxM=maxN<<1;
const int Mod=998244353;

int n,Q,rt;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],D[maxN];
int A[maxN],B[maxN],F[maxN][1<<maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa,int S);
void dfs2(int u,int fa,int S);
int Plus(int x,int y);
int QPow(int x,int cnt);

int main(){
	mem(Head,-1);
	scanf("%d%d%d",&n,&Q,&rt);--rt;
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);--u;--v;
		Add_Edge(u,v);Add_Edge(v,u);++D[u];++D[v];
	}
	for (int S=1;S<(1<<n);S++){
		mem(A,0);mem(B,0);
		dfs1(rt,rt,S);dfs2(rt,rt,S);
	}
	while (Q--){
		int k,S=0;scanf("%d",&k);
		while (k--){
			int u;scanf("%d",&u);--u;
			S|=(1<<u);
		}
		printf("%d\n",F[rt][S]);
	}
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}
void dfs1(int u,int fa,int S){
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) dfs1(V[i],u,S);
	if ((S>>u)&1){
		if ((S^(1<<u))==0) A[u]=B[u]=0;
		else{
			A[u]=B[u]=0;
			for (int i=Head[u];i!=-1;i=Next[i])
				B[u]=Plus(B[u],F[V[i]][S^(1<<u)]);
			B[u]=(1ll*B[u]*QPow(D[u],Mod-2)+1)%Mod;
		}
	}
	else{
		int sa=0,sb=0;
		for (int i=Head[u];i!=-1;i=Next[i])
			if (V[i]!=fa) sa=Plus(sa,A[V[i]]),sb=Plus(sb,B[V[i]]);
		A[u]=QPow(((D[u]-sa)%Mod+Mod)%Mod,Mod-2);
		B[u]=1ll*(D[u]+sb)%Mod*A[u]%Mod;
		if (u==fa) A[u]=0;
	}
	return;
}
void dfs2(int u,int fa,int S){
	if (u==rt) F[u][S]=B[u];
	else F[u][S]=(1ll*A[u]*F[fa][S]%Mod+B[u])%Mod;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) dfs2(V[i],u,S);
	return;
}
int Plus(int x,int y){
	x+=y;if (x>=Mod) x-=Mod;
	return x;
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