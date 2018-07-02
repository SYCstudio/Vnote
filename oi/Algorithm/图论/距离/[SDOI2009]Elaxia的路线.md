# [SDOI2009]Elaxia的路线
[BZOJ1880 Luogu2149]

最近，Elaxia和w的关系特别好，他们很想整天在一起，但是大学的学习太紧张了，他们 必须合理地安排两个人在一起的时间。  
Elaxia和w每天都要奔波于宿舍和实验室之间，他们 希望在节约时间的前提下，一起走的时间尽可能的长。  
现在已知的是Elaxia和w所在的宿舍和实验室的编号以及学校的地图：地图上有N个路 口，M条路，经过每条路都需要一定的时间。 具体地说，就是要求无向图中，两对点间最短路的最长公共路径。

分别求出以$S1,S2,T1,T2$为起点的最短路，得到在两条最短路中都出现的边，可以证明得到的边一定是一个$DAG$，那么用拓扑排序求最长链。注意可以把$S2,T2$反过来。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1510;
const int maxM=501000*2;
const int inf=2147483647;

int n,m;
int S1,S2,T1,T2;
ll D1[maxN],D2[maxN],D3[maxN],D4[maxN];

namespace SPFA
{
	int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
	ll W[maxM];
	bool inq[maxN];
	queue<int> Q;

	void Init();
	void Add_Edge(int u,int v,ll w);
	void Spfa(ll *D,int S);
}

namespace TOP
{
	int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Degree[maxN];
	ll W[maxM];
	ll Depth[maxN];
	int Q[maxN];

	void Init();
	void Add_Edge(int u,int v,ll w);
	ll Get();
}

int main()
{
	SPFA::Init();
	scanf("%d%d",&n,&m);
	scanf("%d%d%d%d",&S1,&T1,&S2,&T2);
	for (int i=1;i<=m;i++)
	{
		int u,v,w;scanf("%d%d%d",&u,&v,&w);
		SPFA::Add_Edge(u,v,w);
	}

	SPFA::Spfa(D1,S1);SPFA::Spfa(D2,T1);SPFA::Spfa(D3,S2);SPFA::Spfa(D4,T2);

	/*
	for (int i=1;i<=n;i++) cout<<D1[i]<<" ";cout<<endl;
	for (int i=1;i<=n;i++) cout<<D2[i]<<" ";cout<<endl;
	for (int i=1;i<=n;i++) cout<<D3[i]<<" ";cout<<endl;
	for (int i=1;i<=n;i++) cout<<D4[i]<<" ";cout<<endl;
	//*/

	TOP::Init();
	for (int i=1;i<=n;i++)
		for (int j=SPFA::Head[i];j!=-1;j=SPFA::Next[j])
		{
			//cout<<i<<" -> "<<SPFA::V[j]<<" "<<D1[i]<<"+"<<SPFA::W[j]<<"+"<<D2[SPFA::V[j]]<<" "<<D1[T1]<<" | "<<D3[i]<<"+"<<SPFA::W[j]<<"+"<<D4[SPFA::V[j]]<<" "<<D3[T2]<<endl;
			if ((D1[i]+SPFA::W[j]+D2[SPFA::V[j]]==D1[T1])&&(D3[i]+SPFA::W[j]+D4[SPFA::V[j]]==D3[T2]))
				TOP::Add_Edge(i,SPFA::V[j],SPFA::W[j]);
		}

	ll Ans=TOP::Get();

	SPFA::Spfa(D3,T2);SPFA::Spfa(D4,S2);

	//for (int i=1;i<=n;i++) cout<<D3[i]<<" ";cout<<endl;
	//for (int i=1;i<=n;i++) cout<<D4[i]<<" ";cout<<endl;
	
	TOP::Init();
	for (int i=1;i<=n;i++)
		for (int j=SPFA::Head[i];j!=-1;j=SPFA::Next[j])
		{
			//cout<<i<<" -> "<<SPFA::V[j]<<" "<<D1[i]<<"+"<<SPFA::W[j]<<"+"<<D2[SPFA::V[j]]<<" "<<D1[T1]<<" | "<<D3[i]<<"+"<<SPFA::W[j]<<"+"<<D4[SPFA::V[j]]<<" "<<D4[T2]<<endl;
			if ((D1[i]+SPFA::W[j]+D2[SPFA::V[j]]==D1[T1])&&(D3[i]+SPFA::W[j]+D4[SPFA::V[j]]==D4[T2]))
				TOP::Add_Edge(i,SPFA::V[j],SPFA::W[j]);
		}
	Ans=max(Ans,TOP::Get());

	printf("%lld\n",Ans);
	return 0;
}

namespace SPFA
{
	void Init(){
		edgecnt=-1;mem(Head,-1);return;
	}

	void Add_Edge(int u,int v,ll w){
		Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
		Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;W[edgecnt]=w;
		return;
	}

	void Spfa(ll *D,int S)
	{
		for (int i=1;i<=n;i++) D[i]=inf;mem(inq,0);while (!Q.empty()) Q.pop();
		D[S]=0;Q.push(S);inq[S]=1;
		do
		{
			int u=Q.front();Q.pop();
			for (int i=Head[u];i!=-1;i=Next[i])
			{
				if (D[V[i]]>D[u]+W[i]){
					D[V[i]]=D[u]+W[i];
					if (inq[V[i]]==0){
						inq[V[i]]=1;Q.push(V[i]);
					}
				}
			}
			inq[u]=0;
		}
		while (!Q.empty());
		return;
	}
}

namespace TOP
{
	void Init(){
		edgecnt=-1;mem(Head,-1);mem(Degree,0);return;
	}
	
	void Add_Edge(int u,int v,ll w){
		//cout<<"Top Add:"<<u<<" "<<v<<endl;
		Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;Degree[v]++;
		return;
	}

	ll Get()
	{
		mem(Depth,0);
		int h=0,t=0;
		for (int i=1;i<=n;i++) if (Degree[i]==0) Q[++h]=i,Depth[i]=0;
		ll Ret=0;
		while (h!=t)
			for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i]){
				Depth[V[i]]=max(Depth[V[i]],Depth[u]+W[i]);Ret=max(Ret,Depth[V[i]]);
				if (--Degree[V[i]]==0) Q[++h]=V[i];
			}
		return Ret;
	}
}
```