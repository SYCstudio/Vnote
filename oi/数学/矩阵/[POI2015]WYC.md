# [POI2015]WYC
[BZOJ4386 Luogu3597]

给定一张n个点m条边的带权有向图，每条边的边权只可能是1，2，3中的一种。将所有可能的路径按路径长度排序，请输出第k小的路径的长度，注意路径不一定是简单路径，即可以重复走同一个点。

求长度小于等于 K 的路径条数比较好求，矩阵快速幂就可以做到。那么在这里要求第 K 小的，可以倍增来做，从高往低枚举 2 的次幂，与当前矩阵相乘看得到的方案数是否大于 K 。由于边权只有 1,2,3 三种，那么可以把点拆成三个，后两个代表延后转移。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=42;
const int maxT=130;
const int maxB=63;
class Mat{
public:
	ll M[maxT][maxT];
	bool sum(ll K){
		if (M[0][0]==-1||M[0][0]>=K) return 0;
		return 1;
	}
};
int n,m;
ll K;
Mat Pw[maxB],Tr,Bp;

Mat operator * (Mat A,Mat B);
void outp(Mat A);

int main(){
	scanf("%d%d%lld",&n,&m,&K);K=K+n;
	for (int i=1;i<=m;i++){
		int u,v,w;scanf("%d%d%d",&u,&v,&w);
		if (w==1) ++Tr.M[u][v];
		if (w==2) ++Tr.M[u][v+n];
		if (w==3) ++Tr.M[u][v+n+n];
	}
	for (int i=1;i<=n;i++) ++Tr.M[i+n][i],++Tr.M[i+n+n][i+n],++Tr.M[i][0];
	Tr.M[0][0]=1;
	Pw[0]=Tr;
	for (int i=1;i<maxB;i++) Pw[i]=Pw[i-1]*Pw[i-1];

	ll Ans=0;mem(Tr.M,0);
	for (int i=1;i<=n;i++) Tr.M[0][i]=1;
	for (int i=maxB-1;i>=0;i--){
		Bp=Tr*Pw[i];
		if (Bp.sum(K)) Tr=Bp,Ans|=(1ll<<i);
	}
	if ((Tr*Pw[0]).sum(K)) printf("-1\n");
	else printf("%lld\n",Ans);return 0;
}
Mat operator * (Mat A,Mat B){
	Mat C;mem(C.M,0);
	for (int i=0;i<=n+n+n;i++)
		for (int j=0;j<=n+n+n;j++)
			for (int k=0;k<=n+n+n;k++){
				if (A.M[i][k]<0||B.M[k][j]<0){
					C.M[i][j]=-1;break;
				}
				else{
					C.M[i][j]+=A.M[i][k]*B.M[k][j];
					if (C.M[i][j]<0){
						C.M[i][j]=-1;break;
					}
				}
			}
	return C;
}
void outp(Mat A){
	for (int i=0;i<=n+n+n;i++){
		for (int j=0;j<=n+n+n;j++)
			cout<<A.M[i][j]<<" ";
		cout<<endl;
	}cout<<endl;
}
```