# [POI2005]KOS-Dicing
[BZOJ1532 Luogu3425]

掷骰子是一种双人游戏，它的结果是完全随机的。最近它在整个Byteotia变得非常流行。在Byteotia的首都甚至有一个特别的掷骰子业余爱好者俱乐部。俱乐部的老主顾们花时间互相聊天并每隔一阵子就和一个随机选择的对手玩这他们最喜欢的游戏。一天中赢得最多游戏的人会得到“幸运者”头衔。有时晚上俱乐部很安静，只有很少的比赛。这是哪怕赢一场也能获得“幸运者”头衔的时间。  
很久很久以前有一个很不走运的人，叫Byteasar，赢得了这个光荣的头衔。他被深深地震惊了以至于完全忘了他已经赢了多少场。现在他想知道他有多幸运，以及幸运之神是否最终会向他微笑——也许他的运气会变好？他确切地知道在那个幸运的晚上有多少场游戏以及是谁玩的。然而，他不知道结果。Byteasar希望查明至少要赢几场才能获得“幸运者”头衔。做个好人，帮他满足他的好奇心吧！

二分答案，对点和边分别建点，建立二分图，判断是否每一条边代表的点都能匹配。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=10100*2;
const int maxM=maxN*8;
const int inf=2147483647;

class Edge
{
public:
	int v,flow,c;
};

int n,m;
int EU[maxN],EV[maxN];
int edgecnt=-1,S,T,Head[maxN],Next[maxM];
Edge E[maxM];
int Depth[maxN],Q[maxN],cur[maxN];

void Add_Edge(int u,int v,int flow);
bool check(int mid);
bool Bfs();
int dfs(int u,int flow);

int main(){
	mem(Head,-1);edgecnt=-1;
	scanf("%d%d",&n,&m);
	S=n+m+1,T=S+1;
	for (int i=1;i<=n;i++) Add_Edge(S,i,0);
	for (int i=1;i<=m;i++){
		scanf("%d%d",&EU[i],&EV[i]);
		Add_Edge(EU[i],i+n,1);
		Add_Edge(EV[i],i+n,1);
		Add_Edge(i+n,T,1);
	}

	int L=1,R=m,Ans=0;
	do{
		int mid=(L+R)>>1;
		if (check(mid)) Ans=mid,R=mid-1;
		else L=mid+1;
	}
	while (L<=R);

	printf("%d\n",Ans);
	check(Ans);

	for (int i=1;i<=m;i++)
		for (int j=Head[i+n];j!=-1;j=Next[j])
			if ((E[j].v>=1)&&(E[j].v<=n)){
				printf(((E[j].flow>0)^(E[j].v==EV[i]))?("1\n"):("0\n"));
				break;
			}

	return 0;
}

void Add_Edge(int u,int v,int flow){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow,flow});
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0,0});
	return;
}

bool check(int mid){
	for (int i=0;i<=edgecnt;i++) E[i].flow=E[i].c;
	for (int i=Head[S];i!=-1;i=Next[i]) E[i].flow=mid;

	int flow=0;
	while (Bfs()){
		for (int i=1;i<=T;i++) cur[i]=Head[i];
		while (int di=dfs(S,inf)) flow+=di;
	}

	return flow==m;
}

bool Bfs(){
	mem(Depth,-1);int h=1,t=0;Q[1]=S;Depth[S]=1;
	do for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
		   if ((E[i].flow)&&(Depth[E[i].v]==-1))
			   Depth[Q[++h]=E[i].v]=Depth[u]+1;
	while (t!=h);
	return Depth[T]!=-1;
}

int dfs(int u,int flow){
	if (u==T) return flow;
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow)&&(Depth[E[i].v]==Depth[u]+1)){
			int di=dfs(E[i].v,min(flow,E[i].flow));
			if (di){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
		}
	return 0;
}
```