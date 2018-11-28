# [IOI2013]Dreaming
[BZOJ3246]

Serpent(水蛇)生活的地方有N个水坑，编号为0，...，N - 1，有M条双向小路连接这些水坑。每两个水坑之间至多有一条路径（路径包含一条或多条小路）相互连接，有些水坑之间根本无法互通(即M ≤ N-1 )。Serpent走过每条小路需要一个固定的天数，不同的小路需要的天数可能不同。Serpent的朋友袋鼠希望新修 N - M - 1条小路，让Serpent可以在任何两个水坑间游走。袋鼠可以在任意两个水坑之间修路，Serpent通过每条新路的时间都是L天。袋鼠希望找到一种修路方式使得修路之后Serpent在每两个水坑之间游走的最长时间最短。

最优的连接方式一定是把所有的森林连成一个菊花。对于每一棵树，求出直径和到最远点距离最小的点，把这个点作为接口去加边连接其它的树。把最大的那个作为新的菊花树的根，剩下的都从接口连接到这个根上。最后的答案有三种方式，一是原来树中的直径，二是最大+次大+一条新增的边，三是次大+次次大+两条新增的边，三者取最大值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=501000;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m,L;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],W[maxM];
int F[maxN][2],P[maxN][2];
int top,Sorter[maxN],St[maxN];
bool vis[maxN];

void Add_Edge(int u,int v,int w);
void dfs1(int u,int fa);
void dfs2(int u,int fa);

int main(){
	mem(Head,-1);
	scanf("%d%d%d",&n,&m,&L);
	for (int i=1;i<=m;i++){
		int u,v,w;scanf("%d%d%d",&u,&v,&w);++u;++v;
		Add_Edge(u,v,w);Add_Edge(v,u,w);
	}
	int Ans=0,scnt=0;
	for (int i=1;i<=n;i++)
		if (vis[i]==0){
			top=0;dfs1(i,i);dfs2(i,i);
			for (int i=1;i<=top;i++) Ans=max(Ans,F[St[i]][0]+F[St[i]][1]);
			Sorter[++scnt]=inf;
			for (int i=1;i<=top;i++) Sorter[scnt]=min(Sorter[scnt],max(F[St[i]][0],F[St[i]][1]));
		}
	sort(&Sorter[1],&Sorter[scnt+1]);reverse(&Sorter[1],&Sorter[scnt+1]);
	if (scnt>=2) Ans=max(Ans,Sorter[1]+Sorter[2]+L);
	if (scnt>=3) Ans=max(Ans,Sorter[2]+Sorter[3]+L+L);
	printf("%d\n",Ans);return 0;
}

void Add_Edge(int u,int v,int w){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
	return;
}

void dfs1(int u,int fa){
	St[++top]=u;vis[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			int v=V[i];dfs1(v,u);
			if (F[v][0]+W[i]>=F[u][0]){
				F[u][1]=F[u][0];P[u][1]=P[u][0];
				F[u][0]=F[v][0]+W[i];P[u][0]=v;
			}
			else if (F[v][0]+W[i]>F[u][1]) F[u][1]=F[v][0]+W[i],P[u][1]=v;
		}
	return;
}

void dfs2(int u,int fa){
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]==fa){
			if (P[fa][0]!=u){
				if (F[fa][0]+W[i]>=F[u][0]){
					F[u][1]=F[u][0];P[u][1]=P[u][0];
					F[u][0]=F[fa][0]+W[i];P[u][0]=fa;
				}
				else if (F[fa][0]+W[i]>F[u][1]) F[u][1]=F[fa][0]+W[i],P[u][1]=fa;
			}
			else if (P[fa][1]!=u){
				if (F[fa][1]+W[i]>=F[u][0]){
					F[u][1]=F[u][0];P[u][1]=P[u][0];
					F[u][0]=F[fa][1]+W[i];P[u][0]=fa;
				}
				else if (F[fa][1]+W[i]>F[u][1]) F[u][1]=F[fa][1]+W[i],P[u][1]=fa;
			}
		}
	for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs2(V[i],u);
	return;
}
```