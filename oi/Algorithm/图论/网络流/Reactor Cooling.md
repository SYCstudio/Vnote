# Reactor Cooling
[ZOJ2314 SGU194 Gym100199B]

The terrorist group leaded by a well known international terrorist Ben Bladen is buliding a nuclear reactor to produce plutonium for the nuclear bomb they are planning to create. Being the wicked computer genius of this group, you are responsible for developing the cooling system for the reactor.  
The cooling system of the reactor consists of the number of pipes that special cooling liquid flows by. Pipes are connected at special points, called nodes, each pipe has the starting node and the end point. The liquid must flow by the pipe from its start point to its end point and not in the opposite direction.  
Let the nodes be numbered from 1 to N. The cooling system must be designed so that the liquid is circulating by the pipes and the amount of the liquid coming to each node (in the unit of time) is equal to the amount of liquid leaving the node. That is, if we designate the amount of liquid going by the pipe from i-th node to j-th as fij, (put fij = 0 if there is no pipe from node i to node j), for each i the following condition must hold:  
f i,1+f i,2+...+f i,N = f 1,i+f 2,i+...+f N,i  
Each pipe has some finite capacity, therefore for each i and j connected by the pipe must be fij <= cij where cij is the capacity of the pipe. To provide sufficient cooling, the amount of the liquid flowing by the pipe going from i-th to j-th nodes must be at least lij, thus it must be fij >= lij.  
Given cij and lij for all pipes, find the amount fij, satisfying the conditions specified above.

求无源无汇上下界可行流，其实还是转化到最大流模型上去，运用补流的思想。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=250;
const int maxM=maxN*maxN*5;
const int inf=2147483647;

class Edge
{
public:
	int v,flow,cap;
};

class EDGE
{
public:
	int u,v,l,r,id;
};

int n,m;
int SS,TT;
int edgecnt,Head[maxN],Next[maxM];
int Sum[maxN];
Edge E[maxM];
EDGE EE[maxM];
int Depth[maxN],Q[maxN],cur[maxN];

void Add_Edge(int u,int v,int flow);
bool Bfs();
int dfs(int u,int flow);

int main()
{
	int TTT;scanf("%d",&TTT);
	while (TTT--)
	{
		scanf("%d%d",&n,&m);
		edgecnt=-1;mem(Head,-1);mem(Sum,0);
		SS=n+1;TT=n+2;
		for (int i=1;i<=m;i++)
		{
			scanf("%d%d%d%d",&EE[i].u,&EE[i].v,&EE[i].l,&EE[i].r);
			EE[i].id=edgecnt+1;
			Add_Edge(EE[i].u,EE[i].v,EE[i].r-EE[i].l);
			Sum[EE[i].v]+=EE[i].l;Sum[EE[i].u]-=EE[i].l;
		}
		int sum1=0,sum2=0;
		for (int i=1;i<=n;i++)
			if (Sum[i]>=0) Add_Edge(SS,i,Sum[i]),sum1+=Sum[i];
			else Add_Edge(i,TT,-Sum[i]),sum2-=Sum[i];
		//cout<<"Init finish sum:"<<sum1<<" "<<sum2<<endl;
		//for (int i=1;i<=n;i++) cout<<Sum[i]<<" ";cout<<endl;
		
		int mxflow=0;
		while (Bfs())
		{
			for (int i=1;i<=TT;i++) cur[i]=Head[i];
			while (int di=dfs(SS,inf)) mxflow+=di;
		}

		if (mxflow!=sum1) printf("NO\n");
		else
		{
			printf("YES\n");
			for (int i=1;i<=m;i++) printf("%d\n",EE[i].l+E[EE[i].id].cap-E[EE[i].id].flow);
		}

		if (TTT) printf("\n");
	}
	return 0;
}

void Add_Edge(int u,int v,int flow)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow,flow});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0,0});
	return;
}

bool Bfs()
{
	mem(Depth,-1);
	int h=1,t=0;Depth[SS]=1;Q[1]=SS;
	do
		for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow>0)&&(Depth[E[i].v]==-1))
				Depth[Q[++h]=E[i].v]=Depth[u]+1;
	while (t!=h);
	return Depth[TT]!=-1;
}

int dfs(int u,int flow)
{
	if (u==TT) return flow;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((E[i].flow>0)&&(Depth[E[i].v]==Depth[u]+1))
		{
			int di=dfs(E[i].v,min(flow,E[i].flow));
			if (di){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
		}
	return 0;
}
```