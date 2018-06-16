# [JSOI2010]Frozen Nova 冷冻波
[BZOJ1822 Luogu4048]

WJJ喜欢“魔兽争霸”这个游戏。在游戏中，巫妖是一种强大的英雄，它的技能Frozen Nova每次可以杀死一个小精灵。我们认为，巫妖和小精灵都可以看成是平面上的点。 当巫妖和小精灵之间的直线距离不超过R，且巫妖看到小精灵的视线没有被树木阻挡（也就是说，巫妖和小精灵的连线与任何树木都没有公共点）的话，巫妖就可以瞬间杀灭一个小精灵。 在森林里有N个巫妖，每个巫妖释放Frozen Nova之后，都需要等待一段时间，才能再次施放。不同的巫妖有不同的等待时间和施法范围，但相同的是，每次施放都可以杀死一个小精灵。 现在巫妖的头目想知道，若从0时刻开始计算，至少需要花费多少时间，可以杀死所有的小精灵？ 

利用计算几何的相关知识，可以算出每一个巫妖是否可以杀死小精灵。二分时间，得到每一个巫妖可以攻击几次，网络流判断可行性。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define sqr(x) (((ld)x)*((ld)x))

const int maxN=210;
const int maxNode=maxN<<1;
const int maxM=maxNode*maxNode*2;
const int inf=2147483647;

class Pos
{
public:
	int x,y;
};

class Line
{
public:
	ld A,B,C;
	Line(Pos p1,Pos p2){
		ld dx=p1.x-p2.x,dy=p1.y-p2.y;
		if (dx==0){
			A=0;B=1;C=-p1.x;return;
		}
		A=dy;B=-dx;C=p1.y*dx-p1.x*dy;
	}
};

class Edge
{
public:
	int v,flow;
};

int n,m,K;
Pos Wz[maxN],Sr[maxN],Wd[maxN];
int Rd[maxN],Tim[maxN],Wr[maxN];
int Link[maxN][maxN];
int S,T;
int edgecnt=-1,Head[maxNode],Next[maxM];
Edge E[maxM];
int Q[maxNode],Depth[maxNode],cur[maxNode];

ld GetNodeDist(Pos p1,Pos p2);
ld GetLineDist(Pos p1,Pos p2,Pos P);
bool Check(int tim);
void Add_Edge(int u,int v,int flow);
bool Bfs();
int dfs(int u,int flow);

int main()
{
	scanf("%d%d%d",&n,&m,&K);
	for (int i=1;i<=n;i++) scanf("%d%d%d%d",&Wz[i].x,&Wz[i].y,&Rd[i],&Tim[i]);
	for (int i=1;i<=m;i++) scanf("%d%d",&Sr[i].x,&Sr[i].y);
	for (int i=1;i<=K;i++) scanf("%d%d%d",&Wd[i].x,&Wd[i].y,&Wr[i]);

	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++)
		{
			if (GetNodeDist(Wz[i],Sr[j])>(ld)Rd[i]) continue;
			bool flag=1;
			for (int k=1;k<=K;k++)
			{
				//cout<<i<<" "<<j<<" "<<k<<endl;
				Line l=((Line){Wz[i],Sr[j]});
				//cout<<"Line:"<<l.A<<" "<<l.B<<" "<<l.C<<" dist:"<<GetLineDist(l,Wd[k])<<" "<<Wr[k]<<endl;
				if (GetLineDist(Wz[i],Sr[j],Wd[k])<=Wr[k]){
					flag=0;break;
				}
			}
			//cout<<"("<<i<<","<<j<<") "<<flag<<endl;
			if (flag) Link[i][j]=1;
		}

	/*
	for (int i=1;i<=n;i++)
	{
		for (int j=1;j<=m;j++)
			cout<<Link[i][j]<<" ";
		cout<<endl;
	}
	//*/

	int L=0,R=0,Ans=-1,mxT=0;S=n+m+1;T=n+m+2;
	for (int i=1;i<=n;i++) mxT=max(mxT,Tim[i]);
	R=mxT*m;

	do
	{
		int mid=(L+R)>>1;
		//cout<<"("<<L<<","<<R<<")"<<endl;
		if (Check(mid)) Ans=mid,R=mid-1;
		else L=mid+1;
	}
	while (L<=R);

	printf("%d\n",Ans);
	return 0;
}

ld GetNodeDist(Pos p1,Pos p2)
{
	return sqrt(sqr(p1.x-p2.x)+sqr(p1.y-p2.y));
}

ld GetLineDist(Pos p1,Pos p2,Pos P)
{
	if ( ((P.x<p1.x)&&(P.x<p2.x)) || ((P.x>p1.x)&&(P.x>p2.x))) return inf;
	Line L=((Line){p1,p2});
	return fabs(L.A*(ld)P.x+L.B*(ld)P.y+L.C)/(sqrt(sqr(L.A)+(sqr(L.B))));
}

bool Check(int tim)
{
	edgecnt=-1;mem(Head,-1);
	//for (int i=1;i<=n;i++) cout<<"("<<Tim[i]<<","<<tim<<","<<tim/Tim[i]<<") ";cout<<endl;
	for (int i=1;i<=n;i++) Add_Edge(S,i,tim/Tim[i]+1);
	for (int i=1;i<=m;i++) Add_Edge(i+n,T,1);
	for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) if (Link[i][j]) Add_Edge(i,j+n,1);

	/*
	for (int i=1;i<=T;i++)
		for (int j=Head[i];j!=-1;j=Next[j])
			if (E[j].flow) cout<<i<<" -> "<<E[j].v<<endl;
	//*/
	
	int mxflow=0;
	while (Bfs())
	{
		for (int i=1;i<=T;i++) cur[i]=Head[i];
		while (int di=dfs(S,inf)) mxflow+=di;
	}
	//cout<<mxflow<<endl;

	return mxflow==m;
}

void Add_Edge(int u,int v,int flow)
{
	edgecnt++;Next[edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
	edgecnt++;Next[edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0});
	return;
}

bool Bfs()
{
	mem(Depth,-1);Depth[S]=1;
	int h=1,t=0;Q[1]=S;
	do
		for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow)&&(Depth[E[i].v]==-1))
				Depth[Q[++h]=E[i].v]=Depth[u]+1;
	while (t!=h);
	//for (int i=1;i<=T;i++) cout<<Depth[i]<<" ";cout<<endl;
	return Depth[T]!=-1;
}

int dfs(int u,int flow)
{
	if (u==T) return flow;
	for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow)&&(Depth[E[i].v]==Depth[u]+1))
		{
			int di=dfs(E[i].v,min(flow,E[i].flow));
			if (di)
			{
				E[i].flow-=di;E[i^1].flow+=di;
				return di;
			}
		}
	return 0;
}
```