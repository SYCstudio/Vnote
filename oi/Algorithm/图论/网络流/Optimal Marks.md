# Optimal Marks
[BZOJ2400 SPOJ OPTM]

定义无向图中的一条边的值为：这条边连接的两个点的值的异或值。  
定义一个无向图的值为：这个无向图所有边的值的和。  
给你一个有n个结点m条边的无向图。其中的一些点的值是给定的，而其余的点的值由你决定（但要求均为非负数），使得这个无向图的值最小。在无向图的值最小的前提下，使得无向图中所有点的值的和最小。  

首先发现，每一位是互相独立的，那么想到按位拆开来考虑。一条边连的两个点如果权值不一样，则为$1$，否则为$0$，相当于是把点集分成两个集合，只有跨越了两个集合的才有贡献，即网络流求最小割。那么对于确定的就直接分别与源汇点连边。  
由于题目还要求在边权最小的情况下点权最小，一种办法是求出最小割后，从汇点$dfs$，标记处尽可能多的$0$。另一种办法是把边的贡献作为第一关键字，点的数量作为第二关键字，将边的权乘以一个较大的数，使得两者互不干扰。

BZOJ
```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=510;
const int maxM=2010*10;
const int inf=2147483647;

class Edge
{
public:
	int v,flow;
};

int n,m;
ll Ans1,Ans2;
int S,T;
int Val[maxN];
int EU[maxM],EV[maxM];
int edgecnt,Head[maxN],Next[maxM];
Edge E[maxM];
int Depth[maxN],Q[maxN],cur[maxN];

void Add_Edge(int u,int v,int flow,int opt);
void Graph(int bit);
bool Bfs();
int dfs(int u,int flow);

int main()
{
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]);
	for (int i=1;i<=m;i++) scanf("%d%d",&EU[i],&EV[i]);
	S=n+1;T=n+2;

	for (int i=31;i>=0;i--)
	{
		Graph(i);
		//cout<<"Build over:"<<i<<endl;
		int mxflow=0;
		while (Bfs())
		{
			for (int j=1;j<=T;j++) cur[j]=Head[j];
			while (ll di=dfs(S,inf)) mxflow+=di;
		}
		//cout<<mxflow<<endl;
		
		int sum1=mxflow/10000,sum2=mxflow%10000;
		//if (sum1||sum2) cout<<sum1<<" "<<sum2<<" "<<mxflow<<endl;
		Ans1=Ans1+(1ll<<i)*sum1;
		Ans2=Ans2+(1ll<<i)*sum2;
	}

	printf("%lld\n%lld\n",Ans1,Ans2);
	return 0;
}

void Add_Edge(int u,int v,int flow,int opt)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,flow*opt});
	return;
}

void Graph(int bit)
{
	mem(Head,-1);edgecnt=-1;
	for (int i=1;i<=n;i++)
		if (Val[i]>=0)
		{
			if ( (Val[i]&(1<<bit)) !=0) Add_Edge(i,T,inf,0),Add_Edge(S,i,1,0);
			else Add_Edge(S,i,inf,0);
		}
		else Add_Edge(S,i,1,0);
	for (int i=1;i<=m;i++) Add_Edge(EU[i],EV[i],10000,1);
	return;
}

bool Bfs()
{
	mem(Depth,-1);Q[1]=S;Depth[S]=1;
	int h=1,t=0;
	do
		for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow>0)&&(Depth[E[i].v]==-1))
				Depth[Q[++h]=E[i].v]=Depth[u]+1;
	while (t!=h);
	return Depth[T]!=-1;
}

int dfs(int u,int flow)
{
	if (u==T) return flow;
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow>0)&&(Depth[E[i].v]==Depth[u]+1))
			if (int di=dfs(E[i].v,min(flow,E[i].flow))){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
	return 0;
}
```
SPOJ
```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=510;
const int maxM=2010*10;
const int inf=2147483647;

class Edge
{
public:
	int v,flow;
};

int n,m;
int S,T;
int Val[maxN];
int EU[maxM],EV[maxM];
int edgecnt,Head[maxN],Next[maxM];
Edge E[maxM];
int Depth[maxN],Q[maxN],cur[maxN];
int Ans[maxN];
bool mark[maxN];

void Add_Edge(int u,int v,int flow,int opt);
void Graph(int bit);
bool Bfs();
int dfs(int u,int flow);
void dfs_mark(int u);

int main()
{
	int TTT;scanf("%d",&TTT);
	while (TTT--)
	{
		mem(Ans,0);mem(Val,-1);
		scanf("%d%d",&n,&m);
		for (int i=1;i<=m;i++) scanf("%d%d",&EU[i],&EV[i]);
		int K;scanf("%d",&K);
		for (int i=1;i<=K;i++)
		{
			int u,p;scanf("%d%d",&u,&p);
			Val[u]=p;
		}
		S=n+1;T=n+2;

		for (int i=30;i>=0;i--)
		{
			Graph(i);
			int mxflow=0;
			while (Bfs())
			{
				for (int j=1;j<=T;j++) cur[j]=Head[j];
				while (ll di=dfs(S,inf)) mxflow+=di;
			}

			//cout<<mxflow<<endl;

			mem(mark,0);
			dfs_mark(S);
			//for (int j=1;j<=n;j++) cout<<mark[j]<<" ";cout<<endl;
			for (int j=1;j<=n;j++) if (mark[j]==0) Ans[j]|=(1ll<<i);
			//cout<<"Ans:";for (int j=1;j<=n;j++) cout<<Ans[j]<<" ";cout<<endl;
		}
		for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);

	}
	return 0;
}

void Add_Edge(int u,int v,int flow,int opt)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,flow*opt});
	return;
}

void Graph(int bit)
{
	mem(Head,-1);edgecnt=-1;
	for (int i=1;i<=n;i++)
		if (Val[i]>=0)
		{
			if ( (Val[i]&(1<<bit)) !=0) Add_Edge(i,T,inf,0),Add_Edge(S,i,1,0);
			else Add_Edge(S,i,inf,0);
		}
		else Add_Edge(S,i,1,0);
	for (int i=1;i<=m;i++) Add_Edge(EU[i],EV[i],10000,1);
	return;
}

bool Bfs()
{
	mem(Depth,-1);Q[1]=S;Depth[S]=1;
	int h=1,t=0;
	do
		for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow>0)&&(Depth[E[i].v]==-1))
				Depth[Q[++h]=E[i].v]=Depth[u]+1;
	while (t!=h);
	return Depth[T]!=-1;
}

int dfs(int u,int flow)
{
	if (u==T) return flow;
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow>0)&&(Depth[E[i].v]==Depth[u]+1))
			if (int di=dfs(E[i].v,min(flow,E[i].flow))){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
	return 0;
}

void dfs_mark(int u)
{
	mark[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((E[i].flow>0)&&(mark[E[i].v]==0)){
			//cout<<u<<" -> "<<E[i].v<<endl;
			dfs_mark(E[i].v);
		}
	return;
}
```