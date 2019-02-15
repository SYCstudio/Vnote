# [JSOI2013]吃货jyy
[BZOJ4479]

作为JSOI的著名吃货，JYY的理想之一就是吃遍全世界的美食。要走遍全世界当然需要不断的坐飞机了。而不同的航班上所提供的餐食是很不一样的：比如中国的航班会提供中餐，英国的航班有奶茶和蛋糕，澳大利亚的航班有海鲜，新加坡的航班会有冰激凌……JYY选出了一些他特别希望品尝餐食的航班，希望制定一个花费最少的旅游计划，能够从南京出发，乘坐所有这些航班并最后回到南京。  
世界上一共有N个JYY愿意去的城市，分别从1编号到N。JYY选出了K个他一定要乘坐的航班。除此之外，还有M个JYY没有特别的偏好，可以乘坐也可以不乘坐的航班。  
一个航班我们用一个三元组(x,y,z)来表示，意义是这趟航班连接城市x和y，并且机票费用是z。每个航班都是往返的，所以JYY花费z的钱，既可以选择从x飞往y，也可以选择从y飞往x。  
南京的编号是1，现在JYY打算从南京出发，乘坐所有K个航班，并且最后回到南京，请你帮他求出最小的花费。

设 F[S] 其中 S 为三进制状态，0/1/2 分别表示未经过、经过奇数次、经过偶数次。转移方式为，找到一个未经过的点，第一种是扫描它所有必须经过的出边，注意最后才把必须经过的边的代价加上，所以这里不需要加上这些边的代价，直接转移；第二种是枚举任意一个已经在点集中的点，直接最短路转移过去就好。  
但是这样我们得到的 S 并不一定满足均经过偶数次，再预处理一个 0/1 状态的数组表示把剩下的度数补全成偶数的最小代价。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<queue>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Min(x,y) x=min(x,y)

const int maxN=14;
const int maxS=1700000;
const int inf=2000000000;

int n,K,m;
int pw2[maxN],pw3[maxN],dis[maxN][maxN];
int cost[1<<maxN],dp[maxS];
vector<int> Me[maxN];
queue<int> Q;
bool inq[maxS];

int main(){
    pw2[0]=pw3[0]=1;for (int i=1;i<maxN;i++) pw2[i]=pw2[i-1]<<1,pw3[i]=pw3[i-1]*3;
    scanf("%d%d",&n,&K);mem(cost,63);mem(dp,63);mem(dis,63);
    int sum=0,must=0;
    for (int i=1;i<=K;i++){
	int u,v,w;scanf("%d%d%d",&u,&v,&w);sum+=w;--u;--v;
	Min(dis[u][v],w);Min(dis[v][u],w);
	Me[u].push_back(v);Me[v].push_back(u);
	must^=pw2[u]^pw2[v];
    }
    scanf("%d",&m);
    for (int i=1;i<=m;i++){
	int u,v,w;scanf("%d%d%d",&u,&v,&w);--u;--v;
	Min(dis[u][v],w);Min(dis[v][u],w);
    }
    for (int i=0;i<n;i++) for (int j=0;j<n;j++) for (int k=0;k<n;k++) Min(dis[j][k],dis[j][i]+dis[i][k]);
    cost[0]=0;
    for (int S=0;S<pw2[n];S++)
	for (int i=0;i<n;i++)
	    if (S&pw2[i])
		for (int j=i+1;j<n;j++)
		    if (S&pw2[j])
			Min(cost[S],cost[S^pw2[i]^pw2[j]]+dis[i][j]);
    dp[2]=0;Q.push(2);inq[2]=1;
    while (!Q.empty()){
	int S=Q.front();Q.pop();
	for (int i=0;i<n;i++)
	    if (S/pw3[i]%3==0){
		for (int j=0,sz=Me[i].size();j<sz;j++)
		    if (S/pw3[Me[i][j]]%3){
			int SS=S+pw3[i]*2;
			if (dp[SS]>dp[S]){
			    dp[SS]=dp[S];
			    if (inq[SS]==0){
				Q.push(SS);inq[SS]=1;
			    }
			}
		    }
		for (int j=0;j<n;j++)
		    if (S/pw3[j]%3){
			int SS=S+pw3[i]+((S/pw3[j]%3==1)?pw3[j]:-pw3[j]);
			if (dp[SS]>dp[S]+dis[i][j]){
			    dp[SS]=dp[S]+dis[i][j];
			    if (inq[SS]==0){
				Q.push(SS);inq[SS]=1;
			    }
			}
		    }
	    }
	inq[S]=0;
    }
    int Ans=inf;
    for (int S=0;S<pw3[n];S++){
	bool flag=1;for (int i=0;i<n&&flag;i++) if (Me[i].size()&&S/pw3[i]%3==0) flag=0;
	if (flag==0) continue;
	int nS=must;for (int i=0;i<n;i++) if (S/pw3[i]%3==1) nS^=pw2[i];
	Ans=min(Ans,dp[S]+cost[nS]);
    }
    printf("%d\n",Ans+sum);return 0;
}
```