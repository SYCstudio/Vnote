# Network Wars
[ZOJ2676 Gym100204G]

 Network of Byteland consists of n servers, connected by m optical cables. Each cable connects two servers and can transmit data in both directions. Two servers of the network are especially important --- they are connected to global world network and president palace network respectively.  
The server connected to the president palace network has number 1, and the server connected to the global world network has number n.  
Recently the company Max Traffic has decided to take control over some cables so that it could see what data is transmitted by the president palace users. Of course they want to control such set of cables, that it is impossible to download any data from the global network to the president palace without transmitting it over at least one of the cables from the set.  
To put its plans into practice the company needs to buy corresponding cables from their current owners. Each cable has some cost. Since the company's main business is not spying, but providing internet connection to home users, its management wants to make the operation a good investment. So it wants to buy such a set of cables, that cables mean cost} is minimal possible.  
That is, if the company buys k cables of the total cost c, it wants to minimize the value of c/k.

题意：给出一张无向图，每一条边有一定的费用$w[i]$，求一个割使得$1$和$n$不连通并且$\frac{\sum x _ i \times w _ i}{\sum x _ i}$最小。

分数规划+最小割。  
有$\frac{\sum x _ i \times w _ i}{\sum x _ i}=Ans$，则变形后得到$\sum x _ i \times (w _ i+Ans)$，若这个式子大于$0$，则说明答案还可以更小，否则，答案更大。  
所以二分答案，然后$Dinic$求解最小割。

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
#define NAME "network"

const int maxN=101;
const int maxM=410*2;
const ld eps=1e-6;
const int inf=2147483647;

class EDGE
{
public:
	int u,v,w;
};

class Edge
{
public:
	int v;
	ld flow;
};

int n,m;
EDGE EE[maxM];
int S,T;
int edgecnt=0,Head[maxN],Next[maxM];
Edge E[maxM];
int Q[maxN],Depth[maxN],cur[maxN],Id[maxM];
bool vis[maxN];

ld Calc(ld K);
void Add_Edge(int u,int v,ld flow,int id);
bool Bfs();
ld dfs(int u,ld flow);
void dfs(int u);

int main()
{
	bool first=0;
	while (scanf("%d%d",&n,&m)!=EOF)
	{
		ld L=inf,R=0,Ans=0;
		for (int i=1;i<=m;i++)
		{
			scanf("%d%d%d",&EE[i].u,&EE[i].v,&EE[i].w);
			//R+=EE[i].w;
			L=min(L,(ld)EE[i].w);R=max(R,(ld)EE[i].w);
		}
		L-=eps;R+=eps;
		//cout<<Calc(2.0)<<endl;
		//cout<<"("<<L<<","<<R<<")"<<endl;
		do
		{
			//cout<<"("<<L<<","<<R<<")"<<endl;
			ld mid=(L+R)/2.0;
			if (Calc(mid)>=-eps) Ans=mid,L=mid+eps;
			else R=mid-eps;
		}
		while(L+eps<=R);

		Calc(Ans);

		//cout<<"Ans:"<<Ans<<endl;

		mem(vis,0);
		dfs(S);
		int cnt=0;
		for (int i=1;i<=m;i++)
			if (EE[i].w<=Ans) cnt++;
			else if (vis[EE[i].u]!=vis[EE[i].v]) cnt++;
		if (first) printf("\n");
		first=1;
		printf("%d\n",cnt);
		bool ot=0;
		for (int i=1;i<=m;i++)
			if (EE[i].w<=Ans)
			{
				if (ot) printf(" ");
				ot=1;
				printf("%d",i);
			}
			else if (vis[EE[i].u]!=vis[EE[i].v])
			{
				if (ot) printf(" ");
				ot=1;
				printf("%d",i);
			}
		printf("\n");
	}
	return 0;
}

ld Calc(ld K)
{
	//cout<<"Check:"<<K<<endl;
	edgecnt=-1;mem(Head,-1);
	ld Ret=0;
	S=1;T=n;
	for (int i=1;i<=m;i++)
	{
		if (EE[i].w>K) Add_Edge(EE[i].u,EE[i].v,EE[i].w-K,i);
		else Ret+=EE[i].w-K;
	}
	while (Bfs())
	{
		for (int i=1;i<=n;i++) cur[i]=Head[i];
		while (ld di=dfs(S,inf)) Ret+=di;
	}
	//cout<<"Check:"<<K<<" "<<Ret<<endl;
	return Ret;
}

void Add_Edge(int u,int v,ld flow,int id)
{
	Id[id]=edgecnt+1;
	edgecnt++;Next[edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
	edgecnt++;Next[edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,flow});
	return;
}

bool Bfs()
{
	int h=1,t=0;mem(Depth,-1);
	Q[1]=S;Depth[S]=1;
	do
	{
		int u=Q[++t];
		for (int i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow>eps)&&(Depth[E[i].v]==-1))
				Depth[Q[++h]=E[i].v]=Depth[u]+1;
	}
	while (t!=h);
	return Depth[T]!=-1;
}

ld dfs(int u,ld flow)
{
	if (u==T) return flow;
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow>eps)&&(Depth[E[i].v]==Depth[u]+1))
		{
			ld di=dfs(E[i].v,min(flow,E[i].flow));
			if (di)
			{
				E[i].flow-=di;
				E[i^1].flow+=di;
				return di;
			}
		}
	return 0.0;
}

void dfs(int u)
{
	vis[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((E[i].flow>eps)&&(vis[E[i].v]==0))
			dfs(E[i].v);
	return;
}
```