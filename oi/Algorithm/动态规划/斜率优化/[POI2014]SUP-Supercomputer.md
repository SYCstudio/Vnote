# [POI2014]SUP-Supercomputer
[BZOJ3835 Luogu3571]

给定一棵N个节点的有根树，根节点为1。Q次询问，每次给定一个K，用最少的操作次数遍历完整棵树，输出最少操作次数。每次操作可以选择访问不超过K个未访问的点，且这些点的父亲必须在之前被访问过。

首先可以知道，对于询问 K ，记 Sum[i] 表示深度大于 i 的节点个数， $Ans[K]=max(i+\frac{Sum[i+1]}{K})$ 。因为一开始每一次操作的节点数是小于 K 个的，其被深度所限制，越过一个阀值后，限制变成 K ，那么上式的具体含义为，枚举前面 i 层，每一层通过一次操作处理掉，后面的操作次数与深度无关，所以直接是后面的总节点个数除以 K 。里面化简得到目的是最大化 $Ki+Sum[i]$ ，可以看作是一个关于 K 的一次函数，其中斜率 i 单增，那么可以用斜率优化来预处理答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Sum[maxN],mxd;
int Q[maxN],Qs[maxN],Ans[maxN];

void Add_Edge(int u,int v);
void dfs(int u,int fa,int d);
ld GetX(int i,int j);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&m);
	for (int i=1;i<=m;i++) scanf("%d",&Qs[i]);
	for (int i=2;i<=n;i++){
		int fa;scanf("%d",&fa);
		Add_Edge(i,fa);Add_Edge(fa,i);
	}
	dfs(1,1,1);
	for (int i=mxd;i>=1;i--) Sum[i]+=Sum[i+1];

	int L=1,R=0;
	for (int i=1;i<=mxd;i++){
		while ((L<R)&&(GetX(i,Q[R-1])<=GetX(Q[R],Q[R-1]))) R--;
		Q[++R]=i;
	}

	for (int i=1;i<=n;i++){
		while ((L<R)&&(1ll*Q[L]*i+Sum[Q[L]+1]<=1ll*Q[L+1]*i+Sum[Q[L+1]+1])) L++;
		Ans[i]=(1ll*Q[L]*i+Sum[Q[L]+1]+i-1)/i;
	}

	for (int i=1;i<=m;i++)
		if (Qs[i]>=n) printf("%d ",mxd);
		else printf("%d ",Ans[Qs[i]]);
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs(int u,int fa,int d){
	Sum[d]++;mxd=max(mxd,d);
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) dfs(V[i],u,d+1);
	return;
}

ld GetX(int i,int j){
	return (ld)(Sum[i+1]-Sum[j+1])/(ld)(j-i);
}
```