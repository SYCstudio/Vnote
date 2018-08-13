# [POI2014]HOT-Hotels（加强版）
[BZOJ4543 Luogu3565]

有一个树形结构，每条边的长度相同，任意两个节点可以相互到达。选3个点。两两距离相等。有多少种方案？

首先可以想到一个$O(n^2)$的$DP$，设$F[u][i]$表示在$u$子树内，距离$u$为$i$的点的个数，$G[u][i]$表示在$u$子树内，满足到$lca$距离为$d$，且$lca$到$u$距离为$d-i$的点对个数，换言之就是在$u$其它子树内与$u$距离为$i$的点能与$u$当前子树内组成答案的点对个数。推理得一下转移方程（注意转移方程的先后顺序）：
$$F[u][i+1]+=F[v][i],G[u][i-1]+=G[v][i],G[u][i+1]+=F[u][i+1] \times F[v][i]$$  
同时还要统计答案，得$Ans+=F[u][i-1] \times G[v][i]+G[u][i+1] \times F[v][i]$。

可以发现，当从$u$的第一个儿子转移过来的时候，$F$向左移动了一位，$G$向右移动了一位，并且此时无法产生贡献，所以考虑让$u$从它的第一个儿子继承过来。由于长度是关于深度的，所以采用长链剖分优化，先预处理出每一个点的$F,G$分别在内存池中的开头，然后对于每一个点继承重链，其它轻链暴力转移。由于每一个点只会在它所在的重链顶部转移一次，所以总复杂度$O(n)$

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*2;
const int maxM=maxN<<1;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Depth[maxN],MxD[maxN],Hson[maxN],Fa[maxN],Top[maxN];
int fcnt=0,gcnt=0,fdfn[maxN],gdfn[maxN];
ll Ans=0,F[maxN],G[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int top);
void dp(int u);

int main(){
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}
	Depth[1]=1;dfs1(1,1);dfs2(1,1);

	dp(1);

	printf("%lld\n",Ans);

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	MxD[u]=Depth[u];
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Fa[V[i]]=u;Depth[V[i]]=Depth[u]+1;dfs1(V[i],u);
			if (MxD[V[i]]>MxD[u]) Hson[u]=V[i],MxD[u]=MxD[V[i]];
		}
	return;
}

void dfs2(int u,int top){
	Top[u]=top;fdfn[u]=++fcnt;
	if (u!=top) gdfn[u]=gdfn[Fa[u]]-1;
	else{
		int len=MxD[u]-Depth[u]+1;
		gcnt+=len;gdfn[u]=gcnt;gcnt+=len-1;
	}
	if (Hson[u]==0) return;
	dfs2(Hson[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=Hson[u]))
			dfs2(V[i],V[i]);
	return;
}

void dp(int u){
	F[fdfn[u]]=1;
	if (Hson[u]==0) return;
	dp(Hson[u]);
	int fu=fdfn[u],gu=gdfn[u];
	Ans+=G[gu];
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=Hson[u])){
			int v=V[i],len=MxD[v]-Depth[v];dp(v);
			int fv=fdfn[v],gv=gdfn[v];
			for (int j=0;j<=len;j++){
				if (j>=1){
					Ans+=1ll*F[fu+j-1]*G[gv+j];
				}
				Ans+=1ll*G[gu+j+1]*F[fv+j];
				if (j>=1) G[gu+j-1]+=G[gv+j];
				G[gu+j+1]+=F[fu+j+1]*F[fv+j];
			}
			for (int j=0;j<=len;j++) F[fu+j+1]+=F[fv+j];
		}
	return;
}
```