# [USACO18JAN]Cow at Large G
[BZOJ5189 Luogu4186]

最后，Bessie被迫去了一个远方的农场。这个农场包含N个谷仓（2 <= N <= 105）和N-1条连接两个谷仓的双向隧道，所以每两个谷仓之间都有唯一的路径。每个只与一条隧道相连的谷仓都是农场的出口。当早晨来临的时候，Bessie将在某个谷仓露面，然后试图到达一个出口。  
但当Bessie露面的时候，她的位置就会暴露。一些农民在那时将从不同的出口谷仓出发尝试抓住Bessie。农民和Bessie的移动速度相同（在每个单位时间内，每个农民都可以从一个谷仓移动到相邻的一个谷仓，同时Bessie也可以这么做）。农民们和Bessie总是知道对方在哪里。如果在任意时刻，某个农民和Bessie处于同一个谷仓或在穿过同一个隧道，农民就可以抓住Bessie。反过来，如果Bessie在农民们抓住她之前到达一个出口谷仓，Bessie就可以逃走。  
Bessie不确定她成功的机会，这取决于被雇佣的农民的数量。给定Bessie露面的谷仓K，帮助Bessie确定为了抓住她所需要的农民的最小数量。假定农民们会自己选择最佳的方案来安排他们出发的出口谷仓。

[USACO18JAN]Cow at Large P 的简化版，只要求一个点的值，那么直接树上 DP 求出距离每一个点最近的叶子的距离，对于 Mn[u]<=dis[u] 的求 2-Dg[u] 的和。

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
const int maxM=maxN<<1;
const int inf=2147483647;

int n,K;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int dis[maxN],Mn[maxN],Dg[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int fa);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&K);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);Dg[u]++;Dg[v]++;
	}

	dis[K]=0;dfs1(K,K);dfs2(K,K);

	int Ans=0;
	if (Dg[K]==1) printf("1\n");
	else{
		for (int i=1;i<=n;i++) if (dis[i]>=Mn[i]) Ans=Ans+2-Dg[i];
		printf("%d\n",Ans);
	}
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	Mn[u]=inf;
	if (Dg[u]==1) Mn[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			dis[V[i]]=dis[u]+1;dfs1(V[i],u);Mn[u]=min(Mn[u],Mn[V[i]]+1);
		}
	return;
}

void dfs2(int u,int fa){
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Mn[V[i]]=min(Mn[V[i]],Mn[u]+1);dfs2(V[i],u);
		}
	return;
}
```