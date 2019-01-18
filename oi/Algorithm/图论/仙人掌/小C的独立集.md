# 小C的独立集
[BZOJ 4316]

图论小王子小C经常虐菜，特别是在图论方面，经常把小D虐得很惨很惨。  
这不，小C让小D去求一个无向图的最大独立集，通俗地讲就是：在无向图中选出若干个点，这些点互相没有边连接，并使取出的点尽量多。  
小D虽然图论很弱，但是也知道无向图最大独立集是npc，但是小C很仁慈的给了一个很有特点的图： 图中任何一条边属于且仅属于一个简单环，图中没有重边和自环。小C说这样就会比较水了。  
小D觉得这个题目很有趣，就交给你了，相信你一定可以解出来的。

在$tarjan$的时候求。设$F[i][0/1]$表示当前点选/不选的最大独立集点数。如果是树的话，直接从儿子转移过来；否则，把环在最早访问到的点考虑，把整个环取出来，然后做两边序列$DP$，一遍强制底不选，一遍强制顶不选，取最大值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50100;
const int maxM=60100<<1;
const int inf=2147483647;

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int dfncnt,dfn[maxN],low[maxN];
int F[maxN][2],G[maxN][2],Fa[maxN];
int Seq[maxN];

void Add_Edge(int u,int v);
void tarjan(int u,int fa);
void RingDp(int tp,int bt);

int main()
{
	mem(Head,-1);
	scanf("%d%d",&n,&m);
	for (int i=1;i<=m;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);
	}

	tarjan(1,1);

	printf("%d\n",max(F[1][0],F[1][1]));

	return 0;
}

void Add_Edge(int u,int v)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
	return;
}

void tarjan(int u,int fa)
{
	dfn[u]=low[u]=++dfncnt;Fa[u]=fa;F[u][1]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa)
		{
			if (dfn[V[i]]==0){
				tarjan(V[i],u);
				low[u]=min(low[u],low[V[i]]);
				if (low[V[i]]>dfn[u]){
					F[u][0]+=max(F[V[i]][0],F[V[i]][1]);
					F[u][1]+=F[V[i]][0];
				}
			}
			else low[u]=min(low[u],dfn[V[i]]);
		}
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(Fa[V[i]]!=u)&&(dfn[V[i]]>dfn[u]))
			RingDp(u,V[i]);
	return;
}

void RingDp(int tp,int bt)
{
	int ncnt=0;
	for (int now=bt;now!=tp;now=Fa[now]) Seq[++ncnt]=now;
	Seq[++ncnt]=tp;


	//强制不选择bt
	G[bt][1]=-inf;G[bt][0]=F[bt][0];
	for (int i=2;i<=ncnt;i++)
	{
		G[Seq[i]][0]=F[Seq[i]][0]+max(G[Seq[i-1]][0],G[Seq[i-1]][1]);
		G[Seq[i]][1]=F[Seq[i]][1]+G[Seq[i-1]][0];
	}

	int mx0=G[tp][0],mx1=G[tp][1];

	//强制不选择tp
	G[bt][1]=F[bt][1];G[bt][0]=F[bt][0];
	for (int i=2;i<=ncnt;i++)
	{
		G[Seq[i]][0]=F[Seq[i]][0]+max(G[Seq[i-1]][0],G[Seq[i-1]][1]);
		G[Seq[i]][1]=F[Seq[i]][1]+G[Seq[i-1]][0];
	}
	mx0=max(G[tp][0],mx0);

	F[tp][0]=max(F[tp][0],mx0);F[tp][1]=max(F[tp][1],mx1);
	return;
}
```

