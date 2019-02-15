# [HAOI2011]Problem c
[BZOJ2303 Luogu2523]

给n个人安排座位，先给每个人一个1~n的编号，设第i个人的编号为ai（不同人的编号可以相同），接着从第一个人开始，大家依次入座，第i个人来了以后尝试坐到ai，如果ai被占据了，就尝试ai+1，ai+1也被占据了的话就尝试ai+2，……，如果一直尝试到第n个都不行，该安排方案就不合法。然而有m个人的编号已经确定(他们或许贿赂了你的上司...)，你只能安排剩下的人的编号，求有多少种合法的安排方案。由于答案可能很大，只需输出其除以M后的余数即可。

归纳可得，若记 Sum[i] 表示编号小于等于 i 的人的数量，当出现任意一个 Sum[i]<i 的时候，一定不合法。开始的时候没有编号的人可以看作是编号为 0 ,统计一遍编号已经确定了的人的前缀和，判断是否已经无解，否则一定有解。  
接下来的问题就只要求合法方案数了，设 F[i][j] 表示编号小于等于 i 的人有 j 个的方案数，那么从 i-1 转移过来的时候枚举 k 表示有 k 人编号为 i 。注意这里 j 和 k 的枚举上下界， 由于 Sum[i] 要大于等于 i ，故 j 下界为 i 上界为 n ；记已经确定编号一定为 i 的人有 num[i] 个，则 k 的枚举下界为 num[i] 上界为 sum[i] 。转移的时候，由于没有确定的人都是相同的，所以要乘以组合数 C[sum[i]-j+num[i]-k][num[i]-k] 得到方案数，前面一项即代表的剩余自由人的数量，而第二项则是需要选择的自由人个数。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=310;
const int inf=2147483647;

int n,m,M;
int sum[maxN],num[maxN],C[maxN][maxN];
int F[maxN][maxN];

int main(){
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		mem(sum,0);mem(num,0);mem(C,0);mem(F,0);
		scanf("%d%d%d",&n,&m,&M);
		for (int i=0;i<=n;i++)
			for (int j=C[i][0]=1;j<=i;j++)
				C[i][j]=(C[i-1][j]+C[i-1][j-1])%M;
		for (int i=1;i<=m;i++){
			int p,q;scanf("%d%d",&p,&q);num[q]++;
		}
		sum[0]=num[0]=n-m;
		bool flag=1;
		for (int i=1;i<=n;i++){
			sum[i]=sum[i-1]+num[i];
			if (sum[i]<i){
				flag=0;break;
			}
		}
		if (flag==0){
			printf("NO\n");continue;
		}
		F[0][0]=1;
		for (int i=1;i<=n;i++)
			for (int j=i;j<=sum[i];j++)
				for (int k=num[i];k<=j;k++)
					F[i][j]=(F[i][j]+1ll*F[i-1][j-k]*C[sum[i]-j+k-num[i]][k-num[i]]%M)%M;
		printf("YES %d\n",F[n][n]);
	}
	return 0;
}
```