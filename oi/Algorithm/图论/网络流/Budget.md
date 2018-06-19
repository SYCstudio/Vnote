# Budget
[POJ2396 ZOJ1994]

We are supposed to make a budget proposal for this multi-site competition. The budget proposal is a matrix where the rows represent different kinds of expenses and the columns represent different sites. We had a meeting about this, some time ago where we discussed the sums over different kinds of expenses and sums over different sites. There was also some talk about special constraints: someone mentioned that Computer Center would need at least 2000K Rials for food and someone from Sharif Authorities argued they wouldn't use more than 30000K Rials for T-shirts. Anyway, we are sure there was more; we will go and try to find some notes from that meeting.  
And, by the way, no one really reads budget proposals anyway, so we'll just have to make sure that it sums up properly and meets all constraints

要求构造一个矩阵，给出矩阵每一行和列的和，以及若干对某一格>,<或=某个数的要求，输出一个合法的构造矩阵。

对行和列分别建点，转化为一个最大流问题。由于是有源汇点上下界可行流，再在原来的基础上建立超级源汇点，连接一条汇点到源点的边使得转化为一个无源无汇的可行流。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=400;
const int maxM=maxN*61;
const int inf=47483647;

class Edge
{
public:
	int v,flow,cap;
};

class EDGE
{
public:
	int u,v,l,r;
	int id;
};

int n,m;
int S,T,SS,TT;
EDGE EE[maxM];
int Min[maxN][maxN],Max[maxN][maxN],Id[maxN][maxN];
int ecnt,edgecnt,Head[maxN],Next[maxM],Sum[maxN];
Edge E[maxM];
int Depth[maxN],Q[maxN],cur[maxN];

void Add_Edge(int u,int v,int flow);
bool Bfs();
int dfs(int u,int flow);

int main()
{
	ios::sync_with_stdio(false);
	
	int TTT;cin>>TTT;
	bool outp=0;
	while (TTT--)
	{
		if (outp) printf("\n");
		outp=1;
		edgecnt=-1;ecnt=0;mem(Head,-1);mem(Sum,0);
		cin>>n>>m;
		S=n+m+1;T=n+m+2;SS=n+m+3;TT=n+m+4;
		int sum1=0,sum2=0;
		//建原图
		for (int i=1;i<=n;i++)
		{
			int key;cin>>key;sum1+=key;
			EE[++ecnt]=((EDGE){S,i,key,key});
		}
		for (int i=1;i<=m;i++)
		{
			int key;cin>>key;sum2+=key;
			EE[++ecnt]=((EDGE){i+n,T,key,key});
		}
		for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) Min[i][j]=0,Max[i][j]=inf;
		int C;cin>>C;
		while (C--)
		{
			int x,y,key;char c;cin>>x>>y>>c>>key;
			if ((x==0)&&(y==0))
			{
				for (int i=1;i<=n;i++)
					for (int j=1;j<=m;j++)
						if (c=='=') Min[i][j]=max(Min[i][j],key),Max[i][j]=min(Max[i][j],key);
						else if (c=='<') Max[i][j]=min(Max[i][j],key-1);
						else if (c=='>') Min[i][j]=max(Min[i][j],key+1);
			}
			else if (x==0)
			{
				for (int i=1;i<=n;i++)
					if (c=='=') Min[i][y]=max(Min[i][y],key),Max[i][y]=min(Max[i][y],key);
					else if (c=='<') Max[i][y]=min(Max[i][y],key-1);
					else if (c=='>') Min[i][y]=max(Min[i][y],key+1);
			}
			else if (y==0)
			{
				for (int i=1;i<=m;i++)
					if (c=='=') Min[x][i]=max(Min[x][i],key),Max[x][i]=min(Max[x][i],key);
					else if (c=='<') Max[x][i]=min(Max[x][i],key-1);
					else if (c=='>') Min[x][i]=max(Min[x][i],key+1);
			}
			else
			{
				if (c=='=') Min[x][y]=max(Min[x][y],key),Max[x][y]=min(Max[x][y],key);
				else if (c=='<') Max[x][y]=min(Max[x][y],key-1);
				else if (c=='>') Min[x][y]=max(Min[x][y],key+1);
			}
		}

		/*
		for (int i=1;i<=n;i++)
		{
			for (int j=1;j<=m;j++)
				cout<<Min[i][j]<<" ";
			cout<<endl;
		}

		for (int i=1;i<=n;i++)
		{
			for (int j=1;j<=m;j++)
				cout<<Max[i][j]<<" ";
			cout<<endl;
		}
		//*/
		
		if (sum1!=sum2){
			printf("IMPOSSIBLE\n");continue;
		}
		bool flag=1;
		for (int i=1;(i<=n)&&(flag);i++)
			for (int j=1;(j<=m)&&(flag);j++)
				if (Min[i][j]>Max[i][j]){
					flag=0;break;
				}
				else EE[Id[i][j]=++ecnt]=((EDGE){i,j+n,Min[i][j],Max[i][j]});
		if (flag==0){
			printf("IMPOSSIBLE\n");continue;
		}
		EE[++ecnt]=((EDGE){T,S,0,inf});

		/*
		for (int i=1;i<=ecnt;i++)
			cout<<EE[i].u<<" "<<EE[i].v<<" ["<<EE[i].l<<","<<EE[i].r<<"]"<<endl;
		//*/

		//建新图
		for (int i=1;i<=ecnt;i++)
		{
			EE[i].id=edgecnt+1;
			Add_Edge(EE[i].u,EE[i].v,EE[i].r-EE[i].l);
			Sum[EE[i].v]+=EE[i].l;Sum[EE[i].u]-=EE[i].l;
		}

		int sum=0;
		for (int i=1;i<=T;i++)
			if (Sum[i]>0) Add_Edge(SS,i,Sum[i]),sum+=Sum[i];
			else Add_Edge(i,TT,-Sum[i]);

		int mxflow=0;
		while (Bfs())
		{
			for (int i=1;i<=TT;i++) cur[i]=Head[i];
			while (int di=dfs(SS,inf)) mxflow+=di;
		}

		//cout<<sum<<endl;
		//cout<<"mxflow:"<<mxflow<<" "<<E[EE[ecnt].id].cap-E[EE[ecnt].id].flow<<endl;

		if (mxflow!=sum){
			printf("IMPOSSIBLE\n");continue;
		}

		for (int i=1;i<=n;i++)
		{
			for (int j=1;j<=m;j++)
				printf("%d ",EE[Id[i][j]].l+E[EE[Id[i][j]].id].cap-E[EE[Id[i][j]].id].flow);
			printf("\n");
		}
	}
}

void Add_Edge(int u,int v,int flow)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow,flow});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0,0});
	return;
}

bool Bfs()
{
	mem(Depth,-1);Depth[SS]=1;
	int h=1,t=0;Q[1]=SS;
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
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow>0)&&(Depth[E[i].v]==Depth[u]+1))
			if (int di=dfs(E[i].v,min(flow,E[i].flow))){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
	return 0;
}
```