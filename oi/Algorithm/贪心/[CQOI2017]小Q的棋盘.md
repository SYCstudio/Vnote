# [CQOI2017]小Q的棋盘
[BZOJ4813 Luogu3698]

小 Q 正在设计一种棋类游戏。  
在小 Q 设计的游戏中，棋子可以放在棋盘上的格点中。某些格点之间有连线，棋子只能在有连线的格点之间移动。整个棋盘上共有 V 个格点，编号为0,1,2 … , V− 1，它们是连通的，也就是说棋子从任意格点出发，总能到达所有的格点。小 Q 在设计棋盘时，还保证棋子从一个格点移动到另外任一格点的路径是唯一的。  
小 Q 现在想知道，当棋子从格点 0 出发，移动 N 步最多能经过多少格点。格点可以重复经过多次，但不重复计数。

先走到最深的地方，然后在分支上选择一些地方走，可以发现这样走不会差，所以求出最深深度，再分类讨论计算一下。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=110;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m,mxd;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];

void Add_Edge(int u,int v);
void dfs(int u,int fa,int depth);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&m);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);u++;v++;
		Add_Edge(u,v);Add_Edge(v,u);
	}

	dfs(1,1,1);

	if (mxd-1>=m) printf("%d\n",m+1);
	else printf("%d\n",min(n,mxd+(m-(mxd-1))/2));

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs(int u,int fa,int depth){
	mxd=max(mxd,depth);
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) dfs(V[i],u,depth+1);
	return;
}
```