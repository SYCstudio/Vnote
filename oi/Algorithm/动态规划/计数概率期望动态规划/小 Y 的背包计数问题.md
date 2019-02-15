# 小 Y 的背包计数问题
[LOJ6089]

小 Y 有一个大小为 $n$ 的背包，并且小 $Y$ 有 $n$ 种物品。  
对于第 $i$ 种物品，共有 $i$ 个可以使用，并且对于每一个 $i$ 物品，体积均为 $i$ 。  
求小 $Y$ 把该背包装满的方案数为多少，答案对于 $23333333$ 取模。  
定义两种不同的方案为：当且仅当至少存在一种物品的使用数量不同。

对于根号 n 将物品分成两类讨论。  
对于小于根号 n 的物品，设 F[i][j] 表示前 i 个物品总体积为 j 的方案数，则有转移方程 $F[i][j]=\sum F[i-1][j-ki]$ ，前缀和优化一下。  
对于大于根号 n 的物品，可以发现物品的数量限制是无用的，同时最多只会选根号 n 个。如果把物品排序后可以发现，需要求的是满足最小的值大于根号 n 的和为 n 的最长不下降序列的个数，设 G[i][j] 表示当前选 i 个数总和为 j 的方案数，有两种构造方式，一是在前面增加一个 $\sqrt{n}+1$ 的数，即从 $G[i-1][j-\sqrt{n}-1]$ 转移过来，另一种是把序列中的每一个数都 +1 ，即从 F[i][j-i] 转移过来。  
得到两个答案后，枚举组合答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxSN=320;
const int Mod=23333333;
const int inf=2147483647;

int n,m;
int F[2][maxN],SF[2][maxN],G[2][maxN],I[maxN];

int main(){
	scanf("%d",&n);m=sqrt(n);
	F[0][0]=SF[0][0]=1;for (int i=1;i<=n;i++) SF[0][i]=1;
	for (int i=1;i<=m;i++){
		int now=i&1;
		F[now][0]=SF[now][0]=1;
		for (int j=1;j<=n;j++){
			if (j-i*(i+1)<0) F[now][j]=SF[now^1][j];
			else F[now][j]=(SF[now^1][j]-SF[now^1][max(0,j-i*(i+1))]+Mod)%Mod;
			if (j-(i+1)<0) SF[now][j]=F[now][j];
			else SF[now][j]=(SF[now][j-(i+1)]+F[now][j])%Mod;
		}
	}

	G[0][0]=I[0]=1;
	for (int i=1;i<=m;i++){
		int now=i&1;
		mem(G[now],0);
		for (int j=0;j<=n;j++){
			if (j-m-1>=0) G[now][j]=(G[now][j]+G[now^1][j-m-1])%Mod;
			if (j-i>=0) G[now][j]=(G[now][j]+G[now][j-i])%Mod;
			I[j]=(I[j]+G[now][j])%Mod;
		}
	}

	int Ans=0;
	for (int i=0;i<=n;i++) Ans=(Ans+1ll*F[m&1][i]*I[n-i]%Mod)%Mod;

	printf("%d\n",Ans);return 0;
}
```