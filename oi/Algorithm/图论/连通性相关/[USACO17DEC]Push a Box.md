# [USACO17DEC]Push a Box
[BZOJ5138 Luogu4082]

The barn can be modeled as an N×MN \times MN×M rectangular grid. Some of the grid cells have hay in them. Bessie occupies one cell in this grid, and a large wooden box occupies another cell. Bessie and the box are not able to fit in the same cell at the same time, and neither can fit into a cell containing hay.  
Bessie can move in the 4 orthogonal directions (north, east, south, west) as long as she does not walk into hay. If she attempts to walk to the space with the box, then the box will be pushed one space in that direction, as long as there is an empty cell on the other side. If there is no empty cell, then Bessie will not be able to make that move.  
A certain grid cell is designated as the goal. Bessie's goal is to get the box into that location.  
Given the layout of the barn, including the starting positions of the box and the cow, and the target position of the box, determine if it possible to win the game.  
Note: This problem allows 512MB of memory usage, up from the default limit of 256MB.  
一个谷仓是一个N*M的矩形网格，有一些网格里有干草。Bessie站在其中一个格子内，还有一个格子里有一个大木箱。Bessie不能和大木箱在一个格子里，也不能和干草在一个格子里。  
如果她不与干草一个格子，她就可以往自己旁边的四个方向（东西南北）移动，如果她想移动到有木箱的格子里，那个木箱就会被她推一格（只要木箱的那个方向还有空间），如果没有空间，那Bessie就不能移动了。  
给你谷仓的布局（空格子，干草以及木箱位置）以及Bessie的出发位置和箱子要被推到的位置，请你帮忙计算Bessie能不能把木箱推到指定位置。

给定箱子的位置，那么当牛没有在箱子旁边一格的时候，是不会对箱子产生影响的，所以设 F[i][j][0-3] 表示箱子在 (i,j) 牛在其 [0-3] 方向这个状态能否到达。那么有两种转移，一种是牛从箱子的某一个方向走到另一个方向，这要求两个点在原图的同一个点双联通分量中；另一种转移是牛顺着这个方向推一格。所以预处理点双联通分量和起始位置， bfs 标记出所有可行的状态。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1600;
const int maxNode=maxN*maxN;
const int maxM=maxNode*8;
const int F1[]={-1,0,1,0};
const int F2[]={0,-1,0,1};
const int inf=2147483647;

class QueueData
{
public:
	int x,y,f;
};

int n,m,stx,sty,bxx,bxy;
char Input[maxN][maxN];
int edgecnt=0,Head[maxNode],Next[maxM],V[maxM],Id[maxN][maxN];
int dfncnt,dfn[maxNode],low[maxNode],bcccnt,top,St[maxNode];
bool inq[4][maxN][maxN],ok[maxN][maxN],vis[maxN][maxN],mark[maxNode];
queue<QueueData> Q;
vector<int> Bcc[maxNode];

void Add_Edge(int u,int v);
void tarjan(int u,int fa);
void Bfs();

int main(){
	mem(Head,-1);
	int Qs;
	scanf("%d%d%d",&n,&m,&Qs);
	for (int i=1,idcnt=0;i<=n;i++) for (int j=1;j<=m;j++) Id[i][j]=++idcnt;
	for (int i=1;i<=n;i++){
		scanf("%s",Input[i]+1);
		for (int j=1;j<=m;j++)
			if (Input[i][j]=='A') stx=i,sty=j,Input[i][j]='.';
			else if (Input[i][j]=='B') bxx=i,bxy=j,Input[i][j]='.';
	}
	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++)
			if (Input[i][j]=='.')
				for (int f=0;f<4;f++)
					if (Input[i+F1[f]][j+F2[f]]=='.')
						Add_Edge(Id[i][j],Id[i+F1[f]][j+F2[f]]);
	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++)
		if ((dfn[Id[i][j]]==0)&&(Input[i][j]=='.')) tarjan(Id[i][j],Id[i][j]);

	Bfs();

	while (!Q.empty()){
		int x=Q.front().x,y=Q.front().y,ff=Q.front().f;Q.pop();
		int xx=x+F1[ff^2],yy=y+F2[ff^2];
		if (Input[xx][yy]=='.'){
			if (inq[ff][xx][yy]==0)
				inq[ff][xx][yy]=1,ok[xx][yy]=1,Q.push((QueueData){xx,yy,ff});
		}
		int u=x+F1[ff],v=y+F2[ff];
		for (int i=0,sz=Bcc[Id[u][v]].size();i<sz;i++) mark[Bcc[Id[u][v]][i]]=1;
		for (int f=0;f<4;f++){
			xx=x+F1[f];yy=y+F2[f];
			if ((f!=ff)&&(xx<=n)&&(xx>=1)&&(yy<=m)&&(yy>=1)&&(inq[f][x][y]==0)){
				bool flag=0;
				for (int i=0,sz=Bcc[Id[xx][yy]].size();i<sz;i++)
					if (mark[Bcc[Id[xx][yy]][i]]) {flag=1;break;}
				if ((flag)&&(inq[f][x][y]==0)){
					inq[f][x][y]=1;ok[x][y]=1;
					Q.push((QueueData){x,y,f});
				}
			}
		}
		for (int i=0,sz=Bcc[Id[u][v]].size();i<sz;i++) mark[Bcc[Id[u][v]][i]]=0;
	}

	while (Qs--){
		int x,y;scanf("%d%d",&x,&y);
		printf(ok[x][y]?("YES\n"):("NO\n"));
	}

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void tarjan(int u,int fa){
	dfn[u]=low[u]=++dfncnt;St[++top]=u;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			if (dfn[V[i]]==0){
				tarjan(V[i],u);
				low[u]=min(low[u],low[V[i]]);
				if (low[V[i]]>=dfn[u]){
					bcccnt++;int v;
					do Bcc[v=St[top--]].push_back(bcccnt);
					while (v!=V[i]);
					Bcc[u].push_back(bcccnt);
				}
			}
			else low[u]=min(low[u],dfn[V[i]]);
		}
	return;
}

void Bfs(){
	Q.push((QueueData){stx,sty,0});
	Input[bxx][bxy]='#';
	do{
		int x=Q.front().x,y=Q.front().y;Q.pop();
		for (int f=0;f<4;f++){
			int xx=x+F1[f],yy=y+F2[f];
			if ((xx<=n)&&(xx>=1)&&(yy<=m)&&(yy>=1)&&(Input[xx][yy]=='.')&&(vis[xx][yy]==0)) vis[xx][yy]=1,Q.push((QueueData){xx,yy,0});
		}
	}
	while (!Q.empty());
	Input[bxx][bxy]='.';
	ok[bxx][bxy]=1;
	for (int f=0;f<4;f++){
		int xx=bxx+F1[f],yy=bxy+F2[f];
		if (vis[xx][yy]) Q.push((QueueData){xx,yy,f});
	}
	return;
}
```