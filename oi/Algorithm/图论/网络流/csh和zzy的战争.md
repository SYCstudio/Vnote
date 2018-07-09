# csh和zzy的战争
[Luogu3652]

现在有n个货物发源地，里面是一些待运送的货物。前方有m个中转小岛，而你的目的是将所有货物运到战争前沿的军事基地，其运送规则如下：  
1.小岛只能由特定的货物发源地发货，其中只有几个指定的小岛可以向军事基地发货。  
2.小岛与小岛之间有e条航道，每条航道上有一个权值v代表这条道路开通的代价，而两个小岛之间开通货运的代价K是两个小岛之间的最短路径长度。  
3.每个小岛上同时最多不能超过w个货物。  
4.每个小岛一次性至多对外运输d个货物，小岛对每个目的地至多送货一次。  
5.有x个特殊货物发源地（不包含在n内）会运送csh和zzy两个人的一些私人的货物，这些货物会被任何一个小岛无条件接受和送出，即不受3，4法则的影响。  
6.整条航路的开发费用为每对小岛开通费用K中的最大值V  
请你寻找一个最小的V使得所有货物都能按照要求运送到军事基地

先用$Floyed$得到每两对中转小岛之间的距离，二分答案，那么距离小于这个答案的航线就可以开通，这样网络流拆点建模，最大流判定是否合法。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=2010;
const int maxM=801000;
const int inf=147483647;

int nb,ni,ns,m;
int Val[maxN];
vector<int> To[maxN];
int L1[maxN],L2[maxN],End[maxN];

bool Check(int val);

namespace FD
{
	int Mat[maxN][maxN];

	void Init();
	void Add_Edge(int u,int v,int w);
	void Do();
}

namespace FL
{
	class Edge
	{
	public:
		int v,flow;
	};

	int S,T,edgecnt,Head[maxN],Next[maxM];
	Edge E[maxM];
	int Q[maxN],Depth[maxN],cur[maxN];

	void Init();
	void Add_Edge(int u,int v,int flow);
	int Mxflow();
	bool Bfs();
	int dfs(int u,int flow);
}

int main()
{
	scanf("%d%d%d%d",&nb,&ni,&ns,&m);FD::Init();
	for (int i=1;i<=nb+ns;i++) scanf("%d",&Val[i]);
	for (int i=1;i<=ni;i++) scanf("%d",&L1[i]);
	for (int i=1;i<=ni;i++) scanf("%d",&L2[i]);
	for (int i=1;i<=ni;i++)
	{
		int k;scanf("%d",&k);
		while (k--)
		{
			int u;scanf("%d",&u);
			To[u].push_back(i);
		}
		scanf("%d",&End[i]);
	}
	for (int i=1;i<=m;i++)
	{
		int u,v,w;scanf("%d%d%d",&u,&v,&w);
		FD::Add_Edge(u,v,w);
	}

	FD::Do();

	int L=0,R=0;
	for (int i=1;i<=ni;i++)
		for (int j=1;j<=ni;j++)
			if ((i!=j)&&(FD::Mat[i][j]<inf)) R=max(R,FD::Mat[i][j]);

	int Ans=-1;

	do
	{
		int mid=(L+R)>>1;
		if (Check(mid)) Ans=mid,R=mid-1;
		else L=mid+1;
	}
	while (L<=R);

	printf("%d\n",Ans);
	return 0;
}

bool Check(int val)
{
	FL::Init();
	FL::S=nb+ns+ni+ni+ni+1;FL::T=FL::S+1;
	int sum=0;
	for (int i=1;i<=nb;i++)
	{
		FL::Add_Edge(FL::S,i,Val[i]);sum+=Val[i];
		for (int j=0;j<To[i].size();j++) FL::Add_Edge(i,nb+ns+To[i][j],inf);
	}
	for (int i=nb+1;i<=ns+nb;i++)
	{
		FL::Add_Edge(FL::S,i,Val[i]);sum+=Val[i];
		for (int j=0;j<To[i].size();j++) FL::Add_Edge(i,nb+ns+ni+ni+To[i][j],inf);
	}
	for (int i=1;i<=ni;i++)
	{
		FL::Add_Edge(nb+ns+i,nb+ns+ni+i,L1[i]);
		if (End[i]) FL::Add_Edge(nb+ns+ni+i,FL::T,L2[i]),FL::Add_Edge(nb+ns+ni+ni+i,FL::T,inf);
		for (int j=1;j<=ni;j++)
			if ((i!=j)&&(FD::Mat[i][j]<=val)) FL::Add_Edge(nb+ns+ni+i,nb+ns+j,L2[i]),FL::Add_Edge(nb+ns+ni+ni+i,nb+ns+ni+ni+j,inf);
	}

	int mxflow=FL::Mxflow();

	return mxflow>=sum;
}

namespace FD
{
	void Init(){
		for (int i=1;i<=ni;i++) for (int j=1;j<=ni;j++) Mat[i][j]=inf;
		return;
	}

	void Add_Edge(int u,int v,int w){
		if (Mat[u][v]==inf) Mat[u][v]=Mat[v][u]=w;
		else Mat[u][v]=Mat[v][u]=Mat[u][v]+w;return;
	}

	void Do()
	{
		for (int k=1;k<=ni;k++)
			for (int i=1;i<=ni;i++)
				if (k!=i)
					for (int j=1;j<=ni;j++)
						if ((i!=j)&&(j!=k))
							Mat[i][j]=min(Mat[i][j],Mat[i][k]+Mat[k][j]);
		return;
	}
}

namespace FL
{
	void Init(){
		edgecnt=-1;mem(Head,-1);return;
	}
	
	void Add_Edge(int u,int v,int flow){
		Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
		Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0});
		return;
	}
	
	int Mxflow(){
		int ret=0;
		while (Bfs())
		{
			for (int i=1;i<=T;i++) cur[i]=Head[i];
			while (int di=dfs(S,inf)) ret+=di;
		}
		return ret;
	}
	
	bool Bfs()
	{
		mem(Depth,-1);Depth[S]=1;Q[1]=S;
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
}
```