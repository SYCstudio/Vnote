# Positions in Permutations
[CF285E]

称一个$1\sim n$ 的排列的完美数为有多少个$i$ 满足$|P_i-i|=1$ 。  
求有多少个长度为$n$ 的完美数恰好为$m$ 的排列。

直接求得恰好为 m 的合法排列数不好求，但求至少有 m 的合法排列数更容易求一些。  
依次考虑每一个数放在什么位置，设 F[i][j][0/1][0/1] 表示前 i 个数，完美数为 j ，位置 i 和 位置 i+1 是否有被占。讨论数 i+1 是不参与还是放在 i 还是放在 i+2 作贡献。最后统计在 G[i] 里面表示完美数至少为 i 的方案数。由于在计算 F 的时候没有把那些不参与贡献的数算进来，所以这里要乘以一个阶乘。  
然后考虑如何反推得答案。设恰好为 i 的排列数为 Ans[i] ，则根据组合意义可以知道 G[i]=Ans[i]+Ans[i+1]C[i+1][i]+Ans[i+2]C[i+2][i]+Ans[i+3]C[i+3][i]+...+Ans[n]C[n][i] ，组合数的意义是对于 i+j 去掉其中  j 个原来强制产生贡献的，有 j 个位置可供选择，剩下的空位还是排上原来的剩余元素，所以是 C[i+j][j] 。从高向低依次计算。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m;
int F[maxN][maxN][2][2];
int G[maxN],Fac[maxN];
int C[maxN][maxN],Ans[maxN];

void Plus(int &x,int y);

int main(){
	scanf("%d%d",&n,&m);
	F[0][0][1][0]=1;
	for (int i=0;i<n;i++)
		for (int j=0;j<=i;j++)
			for (int k=0;k<=1;k++)
				for (int l=0;l<=1;l++){
					int key=F[i][j][k][l];
					Plus(F[i+1][j][l][0],key);
					if (k==0) Plus(F[i+1][j+1][l][0],key);
					if (i+1!=n) Plus(F[i+1][j+1][l][1],key);
				}
	Fac[0]=1;for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;

	for (int i=0;i<=n;i++){
		for (int k=0;k<=1;k++)
			for (int l=0;l<=1;l++)
				Plus(G[i],F[n][i][k][l]);
		G[i]=1ll*G[i]*Fac[n-i]%Mod;
	}

	for (int i=0;i<=n;i++){
		C[i][0]=1;
		for (int j=1;j<=i;j++)
			C[i][j]=(C[i-1][j]+C[i-1][j-1])%Mod;
	}

	Ans[n]=G[n];
	for (int i=n-1;i>=m;i--){
		Ans[i]=G[i];
		for (int j=i+1;j<=n;j++)
			Ans[i]=(Ans[i]-1ll*C[j][i]*Ans[j]%Mod+Mod)%Mod;
	}

	printf("%d\n",Ans[m]);

	return 0;
}

void Plus(int &x,int y){
	x=(x+y)%Mod;return;
}
```