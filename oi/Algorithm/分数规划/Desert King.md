# Desert King
[POJ2728 UVAlive3465]

David the Great has just become the king of a desert country. To win the respect of his people, he decided to build channels all over his country to bring water to every village. Villages which are connected to his capital village will be watered. As the dominate ruler and the symbol of wisdom in the country, he needs to build the channels in a most elegant way.  
After days of study, he finally figured his plan out. He wanted the average cost of each mile of the channels to be minimized. In other words, the ratio of the overall cost of the channels to the total length must be minimized. He just needs to build the necessary channels to bring water to all the villages, which means there will be only one way to connect each village to the capital.  
His engineers surveyed the country and recorded the position and altitude of each village. All the channels must go straight between two villages and be built horizontally. Since every two villages are at different altitudes, they concluded that each channel between two villages needed a vertical water lifter, which can lift water up or let water flow down. The length of the channel is the horizontal distance between the two villages. The cost of the channel is the height of the lifter. You should notice that each village is at a different altitude, and different channels can't share a lifter. Channels can intersect safely and no three villages are on the same line.  
As King David's prime scientist and programmer, you are asked to find out the best solution to build the channels. 

题意：给出$n$个三维空间中的点的坐标，定义两点之间的距离为平面距离，代价为高度之差。求一棵生成树使得$\frac{总代价}{总距离}$最小

分数规划。  
若答案为$K$，则有$总代价-总距离 \times K=0$，所以以这个为权值求最小生成树。可以采用二分或$Dinkelbach$的方式。这里用$Dinkelbach$更快。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<queue>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define sqr(x) ((x)*(x))
#define GetDist(i,j) (sqrt(sqr(X[i]-X[j])+sqr(Y[i]-Y[j])))

const int maxN=1010;
const ld eps=1e-8;
const int inf=2147483647;

class HData
{
public:
	int u;
	ld dist;
};

int n;
int X[maxN],Y[maxN],Z[maxN];
ld Dist[maxN],S1[maxN],S2[maxN];
bool vis[maxN];
priority_queue<HData> H;

bool operator < (HData A,HData B);
ld Calc(ld K);

int main()
{
	while (scanf("%d",&n)!=EOF)
	{
		if (n==0) break;
		for (int i=1;i<=n;i++) scanf("%d%d%d",&X[i],&Y[i],&Z[i]);
		ld L=0,Ans;
		do
		{
			Ans=Calc(L);
			//cout<<L<<" "<<Ans<<endl;
			if (fabs(Ans-L)>eps) L=Ans;
			else break;
		}
		while (1);
		printf("%.3LF\n",Ans);
	}
	return 0;
}

bool operator < (HData A,HData B){
	return A.dist>B.dist;
}

ld Calc(ld K)
{
	for (int i=1;i<=n;i++) Dist[i]=inf;
	mem(vis,0);while (!H.empty()) H.pop();
	Dist[1]=0;H.push((HData){1,Dist[1]});
	ld sum1=0,sum2=0;
	do
	{
		int u=H.top().u;H.pop();
		if (vis[u]) continue;
		vis[u]=1;sum1+=S1[u];sum2+=S2[u];
		for (int i=1;i<=n;i++)
			if ((vis[i]==0)&&(Dist[i]>abs(Z[u]-Z[i])-K*1.0*GetDist(u,i)))
			{
				Dist[i]=abs(Z[u]-Z[i])-K*1.0*GetDist(u,i);
				//cout<<u<<"->"<<i<<" "<<Dist[i]<<" "<<endl;
				H.push((HData){i,Dist[i]});
				S1[i]=abs(Z[u]-Z[i]);S2[i]=GetDist(u,i);
			}
	}
	while (!H.empty());
	return sum1/sum2;
}
```