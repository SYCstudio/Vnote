# [USACO07NOV]Cow Relays
[BZOJ1706,Luogu2886]

FJ的N(2 <= N <= 1,000,000)头奶牛选择了接力跑作为她们的日常锻炼项目。至于进行接力跑的地点 自然是在牧场中现有的T(2 <= T <= 100)条跑道上。 农场上的跑道有一些交汇点，每条跑道都连结了两个不同的交汇点 I1_i和I2_i(1 <= I1_i <= 1,000; 1 <= I2_i <= 1,000)。每个交汇点都是至少两条跑道的端点。 奶牛们知道每条跑道的长度length_i(1 <= length_i <= 1,000)，以及每条跑道连结的交汇点的编号 并且，没有哪两个交汇点由两条不同的跑道直接相连。你可以认为这些交汇点和跑道构成了一张图。 为了完成一场接力跑，所有N头奶牛在跑步开始之前都要站在某个交汇点上（有些交汇点上可能站着不只1头奶牛）。当然，她们的站位要保证她们能够将接力棒顺次传递，并且最后持棒的奶牛要停在预设的终点。 你的任务是，写一个程序，计算在接力跑的起点(S)和终点(E)确定的情况下，奶牛们跑步路径可能的最小总长度。显然，这条路径必须恰好经过N条跑道。

注意到实际上的点数只有$200$左右，所以$Floyed$倍增求解，类似矩阵乘法。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxNode=1010000;
const int maxN=210;
const int inf=1147483647;
const ll INF=1e15;

int n,m,S,T;
int nodecnt=0,Map[maxNode];
ll Mat[21][maxN][maxN];
ll Ans[maxN][maxN],Bp[maxN][maxN];

void Mul(int id);

int main()
{
	scanf("%d%d%d%d",&n,&m,&S,&T);
	mem(Mat,63);
	for (int i=1;i<=m;i++)
	{
		int u,v,len;
		scanf("%d%d%d",&len,&u,&v);
		if (Map[u]==0) Map[u]=++nodecnt;
		if (Map[v]==0) Map[v]=++nodecnt;
		u=Map[u];v=Map[v];
		Mat[0][u][v]=Mat[0][v][u]=len;
	}
	S=Map[S];T=Map[T];
	for (int i=1;i<=20;i++)
		for (int k=1;k<=nodecnt;k++)
			for (int u=1;u<=nodecnt;u++)
				for (int v=1;v<=nodecnt;v++)
					Mat[i][u][v]=Mat[i][v][u]=min(Mat[i][u][v],Mat[i-1][u][k]+Mat[i-1][k][v]);
	for (int i=1;i<=nodecnt;i++) for (int j=1;j<=nodecnt;j++) Ans[i][j]=Mat[0][i][j];
	n--;
	for (int i=0;i<21;i++) if (n&(1<<i)) Mul(i);

	printf("%lld\n",Ans[S][T]);
	return 0;
}

void Mul(int id)
{
	for (int i=1;i<=nodecnt;i++) for (int j=1;j<=nodecnt;j++) Bp[i][j]=Ans[i][j],Ans[i][j]=INF;
	for (int k=1;k<=nodecnt;k++)
		for (int i=1;i<=nodecnt;i++)
			for (int j=1;j<=nodecnt;j++)
				Ans[i][j]=Ans[j][i]=min(Ans[i][j],Bp[i][k]+Mat[id][k][j]);
	return;
}
```