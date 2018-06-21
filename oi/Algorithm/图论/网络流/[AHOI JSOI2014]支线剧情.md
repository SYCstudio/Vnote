# [AHOI JSOI2014]支线剧情
[BZOJ3876 Luogu4043]

宅男JYY非常喜欢玩RPG游戏，比如仙剑，轩辕剑等等。不过JYY喜欢的并不是战斗场景，而是类似电视剧一般的充满恩怨情仇的剧情。这些游戏往往都有很多的支线剧情，现在JYY想花费最少的时间看完所有的支线剧情。  
JYY现在所玩的RPG游戏中，一共有N个剧情点，由1到N编号，第i个剧情点可以根据JYY的不同的选择，而经过不同的支线剧情，前往Ki种不同的新的剧情点。当然如果为0，则说明i号剧情点是游戏的一个结局了。  
JYY观看一个支线剧情需要一定的时间。JYY一开始处在1号剧情点，也就是游戏的开始。显然任何一个剧情点都是从1号剧情点可达的。此外，随着游戏的进行，剧情是不可逆的。所以游戏保证从任意剧情点出发，都不能再回到这个剧情点。由于JYY过度使用修改器，导致游戏的“存档”和“读档”功能损坏了，所以JYY要想回到之前的剧情点，唯一的方法就是退出当前游戏，并开始新的游戏，也就是回到1号剧情点。JYY可以在任何时刻退出游戏并重新开始。不断开始新的游戏重复观看已经看过的剧情是很痛苦，JYY希望花费最少的时间，看完所有不同的支线剧情。

每一条边都至少要走一次，所以是上下界最小费用可行流。

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

const int maxN=310;
const int maxM=10010*10;
const int inf=2147483647;

class Edge
{
public:
	int u,v,flow,w;
};

int n,S,T,SS,TT;
int edgecnt=-1,Head[maxN],Next[maxM],Sum[maxN];
Edge E[maxM];
int Dist[maxN],Path[maxN],Flow[maxN];
queue<int> Q;
bool inq[maxN];

void Add_Edge(int u,int v,int flow,int w);
bool spfa();

int main()
{
	mem(Head,-1);int Ans=0;
	scanf("%d",&n);S=1;T=n+1;SS=T+1;TT=SS+1;
	for (int i=1;i<=n;i++)
	{
		int K;scanf("%d",&K);
		for (int j=1;j<=K;j++)
		{
			int v,t;scanf("%d%d",&v,&t);
			Sum[i]-=1;Sum[v]+=1;
			Add_Edge(i,v,inf,t);Ans+=t;
		}
	}
	for (int i=2;i<=n;i++) Add_Edge(i,T,inf,0);

	for (int i=1;i<=n;i++)
		if (Sum[i]>0) Add_Edge(SS,i,Sum[i],0);
		else if (Sum[i]<0) Add_Edge(i,TT,-Sum[i],0);
	Add_Edge(T,S,inf,0);

	while (spfa())
	{
		Ans=Ans+Flow[TT]*Dist[TT];
		int now=TT;
		while (now!=SS){
			E[Path[now]].flow-=Flow[TT];E[Path[now]^1].flow+=Flow[TT];now=E[Path[now]].u;
		}
	}

	printf("%d\n",Ans);

	return 0;
}

void Add_Edge(int u,int v,int flow,int w)
{
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){u,v,flow,w});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){v,u,0,-w});
	return;
}

bool spfa()
{
	for (int i=1;i<=TT;i++) Dist[i]=inf;mem(inq,0);
	Q.push(SS);Dist[SS]=0;inq[SS]=1;Flow[SS]=inf;
	do
	{
		int u=Q.front();Q.pop();
		for (int i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow>0)&&(Dist[E[i].v]>Dist[u]+E[i].w))
			{
				Dist[E[i].v]=Dist[u]+E[i].w;Flow[E[i].v]=min(Flow[u],E[i].flow);Path[E[i].v]=i;
				if (inq[E[i].v]==0){
					inq[E[i].v]=1;Q.push(E[i].v);
				}
			}
		inq[u]=0;
	}
	while (!Q.empty());
	return Dist[TT]!=inf;
}
```