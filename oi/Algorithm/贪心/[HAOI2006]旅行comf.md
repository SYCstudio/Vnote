# [HAOI2006]旅行comf
[BZOJ1050 Luogu2502]

Z小镇是一个景色宜人的地方，吸引来自各地的观光客来此旅游观光。Z小镇附近共有N个景点（编号为1,2,3,…,N），这些景点被M条道路连接着，所有道路都是双向的，两个景点之间可能有多条道路。也许是为了保护该地的旅游资源，Z小镇有个奇怪的规定，就是对于一条给定的公路Ri，任何在该公路上行驶的车辆速度必须为Vi。速度变化太快使得游客们很不舒服，因此从一个景点前往另一个景点的时候，大家都希望选择行使过程中最大速度和最小速度的比尽可能小的路线，也就是所谓最舒适的路线。

把边排序，相当于枚举小的，然后求最小生成树直到$S,T$连通。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=510;
const int maxM=5010;
const int inf=2147483647;

class Edge
{
public:
	int u,v,w;
};

int n,m,S,T;
Edge E[maxM];
int UFS[maxN];

bool cmp(Edge A,Edge B);
int Find(int u);
ll gcd(ll a,ll b);

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=m;i++) scanf("%d%d%d",&E[i].u,&E[i].v,&E[i].w);
	scanf("%d%d",&S,&T);
	sort(&E[1],&E[m+1],cmp);

	ld Ans=inf;
	ll fm,fz;
	for (int i=1;i<=m;i++){
		for (int j=1;j<=n;j++) UFS[j]=j;
		int p;
		for (p=i;p<=m;p++){
			if (Find(E[p].u)!=Find(E[p].v)){
				UFS[Find(E[p].u)]=Find(E[p].v);
			}
			if (Find(S)==Find(T)) break;
		}
		if (Find(S)==Find(T)){
			if (Ans>(ld)E[p].w/(ld)E[i].w){
				Ans=(ld)E[p].w/(ld)E[i].w;
				fz=E[p].w;fm=E[i].w;
			}
		}
		else break;
	}

	if (Ans==inf) printf("IMPOSSIBLE\n");
	else{
		int d=gcd(fm,fz);
		fm/=d;fz/=d;
		if (fm==1) printf("%lld\n",fz);
		else printf("%lld/%lld\n",fz,fm);
	}

	return 0;
}

bool cmp(Edge A,Edge B){
	return A.w<B.w;
}

int Find(int u){
	if (UFS[u]!=u) UFS[u]=Find(UFS[u]);
	return UFS[u];
}

ll gcd(ll a,ll b){
	ll t;
	while (a) t=a,a=b%a,b=t;
	return b;
}
```