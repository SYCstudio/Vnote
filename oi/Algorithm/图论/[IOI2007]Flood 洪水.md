# [IOI2007]Flood 洪水
[BZOJ1804 Luogu4646]

1964年的一场灾难性的洪水冲毁了萨格勒布城。洪水袭来时许多建筑的墙被彻底冲毁。在这个题目中，给定了城市在洪水来袭前的简化模型，你的任务是确定洪水过后哪些墙没有被冲毁。  
简化模型由平面上的 $N$ 个点和 $W$ 堵墙构成。每堵墙连接两个点，没有任何一堵墙通过其它点。模型具有如下性质：  
不存在两堵墙相交或者重合的情况，但是两堵墙可以在端点相连；  
每堵墙或者平行于坐标系的横轴，或者平行于坐标系的纵轴。  
最开始，整个坐标平面都是干的。在零时刻，洪水将城市的外围淹没（城市的外围是指没有被墙围起来的区域）。一个小时之后，所有一边是水，一边是空气的墙在水的压力下都会倒塌。于是洪水又会吞没那些没有被完好的墙围住的区域。接下来又有一些墙面临一边是水一边是空气，将要被洪水冲毁的局面。又过了一个小时，这些墙也被冲毁了。这样的过程不断重复，直到洪水淹没整个城市。  
下图给出了洪水侵袭过程的一个例子。  
![BZOJ1804](_v_images/_bzoj1804_1530528647_543430809.jpg)
给定 $N$ 个点的坐标和连接这些点的 $W$ 堵墙的描述，编程确定洪水过后，哪些墙会被留下来。 

思路其实并不难，把图转化为对偶图后，从最外层开始，求得每一个点的深度，也就是水到达这个地方的时间。那么如果一堵墙的两侧的点深度相同，则说明这堵墙的两边是同时灌满水的， 那么这堵墙就可以保留下来，否则不行。实际上，要求深度的奇偶性相同就可以了。  
关键在于怎么把图转成对偶图。选择一个点，尽量向左走，如果不行，则向前，还不行则向右，最后再选择回退。这样如果能够最终回到起点，说明行走的左边部分是一个封闭区域，可以标记出来了。那么每次这么走的时候都标记出行走方向左边的区域。但是对于右侧的怎么办呢？记录一下总共向左向右转了多少次，如果是向右转得多，说明先前标记处的左边是空区域，可以认为是最外面一层，或是里面与外面不相接的一层，这个是需要作为求深度的开头的，标记一下。  
至于求方案，可以记录一下每一个点出发的墙的输入顺序，然后标记输出。

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

const int maxN=101000*4;
const int maxM=maxN<<1;
const int F1[]={1,0,-1,0};
const int F2[]={0,-1,0,1};
const int inf=2147483647;

class Pos
{
public:
	int x,y;
	int To[4],Id[4];
	int Idl[4],Idr[4];
};

int n,m;
int nodecnt=-1,Bg[maxN];
Pos P[maxN];
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM],Depth[maxN];
queue<int> Q;

void Add_Wall(int u,int v,int id);
void GetGraph(int id);
void Add_Edge(int u,int v);

int main()
{
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d%d",&P[i].x,&P[i].y);
	scanf("%d",&m);
	for (int i=1;i<=m;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Wall(u,v,i);
	}

	/*
	for (int i=1;i<=n;i++)
		for (int j=0;j<4;j++)
			if (P[i].To[j]) cout<<i<<" -> "<<P[i].To[j]<<" ["<<j<<"]"<<endl;
	//*/
	
	for (int i=1;i<=n;i++) GetGraph(i);
	for (int i=1;i<=n;i++)
		for (int j=0;j<4;j++)
			if (P[i].To[j])
			{
				Add_Edge(P[i].Idl[j],P[i].Idr[j]);
				Add_Edge(P[i].Idr[j],P[i].Idl[j]);
			}

	/*
	for (int i=1;i<=n;i++)
		for (int j=0;j<4;j++)
			if (P[i].To[j])
				cout<<i<<":["<<j<<"] "<<P[i].Idl[j]<<" "<<P[i].Idr[j]<<endl;
	//*/

	mem(Depth,-1);
	for (int i=1;i<=nodecnt;i++) if (Bg[i]) Q.push(i),Depth[i]=1;
	
	while (!Q.empty())
	{
		int u=Q.front();Q.pop();//cout<<u<<" ";cout<<endl;
		for (int i=Head[u];i!=-1;i=Next[i])
			if (Depth[V[i]]==-1){
				Depth[V[i]]=Depth[u]^1;Q.push(V[i]);
			}
	}

	//for (int i=1;i<=nodecnt;i++) cout<<Depth[i]<<" ";cout<<endl;
	
	int Ans=0;
	for (int i=0;i<=edgecnt;i+=2) if (Depth[V[i]]==Depth[V[i^1]]) Ans++;

	printf("%d\n",Ans>>1);
	for (int i=1;i<=n;i++)
		for (int j=0;j<4;j++)
			if (P[i].To[j]>i)
				if (Depth[P[i].Idl[j]]==Depth[P[i].Idr[j]]) printf("%d\n",P[i].Id[j]);
	return 0;
}

void Add_Wall(int u,int v,int id)
{
	if (P[u].x==P[v].x){
		if (P[u].y<=P[v].y) P[u].To[3]=v,P[v].To[1]=u,P[u].Id[3]=P[v].Id[1]=id;
		else P[u].To[1]=v,P[v].To[3]=u,P[u].Id[1]=P[v].Id[3]=id;
	}
	else{
		if (P[u].x<=P[v].x) P[u].To[0]=v,P[v].To[2]=u,P[u].Id[0]=P[v].Id[2]=id;
		else P[u].To[2]=v,P[v].To[0]=u,P[u].Id[2]=P[v].Id[0]=id;
	}
	return;
}

void GetGraph(int id)
{
	//cout<<"GetGraph:"<<id<<endl;
	for (int f=0;f<4;f++)
		if ((P[id].To[f])&&(P[id].Idl[f]==0))
		{
			int nowf=f,cnt=0,u=id,v;
			bool flag=1;nodecnt++;
			while ((u!=id)||(flag==1))
			{
				v=P[u].To[nowf];flag=0;
				P[u].Idl[nowf]=P[v].Idr[(nowf+2)%4]=nodecnt;
				cnt--;nowf=(nowf-1+4)%4;u=v;
				while (P[u].To[nowf]==0){
					nowf=(nowf+1)%4;cnt++;
				}
			}
			if (cnt>0) Bg[nodecnt]=1;
		}
	return;
}

void Add_Edge(int u,int v){
	//cout<<"Add:"<<u<<" "<<v<<endl;
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

```