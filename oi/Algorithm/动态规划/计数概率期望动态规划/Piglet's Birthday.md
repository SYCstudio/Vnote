# Piglet's Birthday
[CF248E]

给定 $n$ 个货架，初始时每个上面有 $a[i]$ 个蜜罐。  
有 $q$ 次操作，每次操作形如 $u,v,k$ ，表示从货架 $u$ 上任意选择 $k$ 个蜜罐试吃（吃过的也还能吃），吃完后把这 $k$ 个蜜罐放到 $v$ 货架上去。  
每次操作完之后回答所有蜜罐都被试吃过的货架数量的期望。

每个货架上新来的蜜罐一定是试吃过的，那么也就是说未被试吃的部分是单调不增的。  
由于同时又有任意时刻，每一个货架上的蜜罐数量是唯一确定的，那么只要确定了未被试吃的部分，试吃的部分也就知道了。  
设 F[i][j] 表示当前货架 i 中还有 j 个未被试吃的期望，每次货架转移的时候，枚举在未被吃的中挑选多少个，在已经试吃过的中挑选多少个，组合数算方案数。答案就是实时维护的 F[i][0] 的和。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxM=110;
const int inf=2147483647;

int n,m;
int Num[maxN],INum[maxN];
ld F[maxN][maxM];
ld C[maxN][10];

ld GetC(int n,int m);

int main(){
	C[0][0]=1;
	for (int i=1;i<maxN;i++){
		C[i][0]=1;
		for (int j=1;j<=min(i,9);j++)
			C[i][j]=C[i-1][j]+C[i-1][j-1];
	}
	
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Num[i]),F[i][INum[i]=Num[i]]=1;
	ld Ans=0;
	for (int i=1;i<=n;i++) Ans+=F[i][0];
	int Q;scanf("%d",&Q);
	while (Q--){
		int u,v,key;scanf("%d%d%d",&u,&v,&key);
		Ans-=F[u][0];
		for (int j=0;j<=min(INum[u],Num[u]);j++){
			ld nf=F[u][j];F[u][j]=0;
			for (int k=0;k<=min(j,key);k++)
				F[u][j-k]+=nf/C[Num[u]][key]*C[j][k]*C[Num[u]-j][key-k];
		}

		Num[u]-=key;Num[v]+=key;
		Ans+=F[u][0];

		printf("%.11lf\n",Ans);
	}

	return 0;
}
```