# Binary Table
[CF662C]

You are given a table consisting of n rows and m columns. Each cell of the table contains either 0 or 1. In one move, you are allowed to pick any row or any column and invert all values, that is, replace 0 by 1 and vice versa.  
What is the minimum number of cells with value 1 you can get after applying some number of operations?

$n$只有$20$，所以可以考虑状压。  
当行的变换方式确定的时候，每一个列的答案就是$0$和$1$中出现次数较小的那个，可以设$b[i]$表示$i$的答案，这个可以$O(n)$地预处理出来。又因为列数值相同的答案其实是一样的，所以可以合并到一起来做，记$a[i]$为状态$i$的出现次数  
设行变换为$i$的答案为$f[i]$，那么有转移式$f[k]=\sum\_{i \wedge k==j}a[i] b[j]$，根据异或的性质$i \wedge k==j$等价于$i \wedge j==k$，所以有$f[k]=\sum\_{i \wedge j==k}a[i]b[j]$，即是一个异或卷积的形式，用$FWT$优化。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=21;
const int maxM=101000;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,inv2;
char Input[maxN][maxM];
int A[1<<(maxN+1)],B[1<<(maxN+1)];

int QPow(int x,int cnt);
void FWT(int *P,int N,int opt);

int main()
{
	scanf("%d%d",&n,&m);
	inv2=QPow(2,Mod-2);
	for (int i=1;i<=n;i++) scanf("%s",Input[i]+1);
	int mx=0;
	for (int i=1;i<=m;i++)
	{
		int key=0;
		for (int j=1;j<=n;j++) if (Input[j][i]=='1') key|=(1<<(j-1));
		A[key]++;mx=max(mx,key);
	}
	int N=1<<n;
	for (int i=0;i<N;i++) B[i]=B[i>>1]+(i&1);
	for (int i=0;i<N;i++) B[i]=min(B[i],n-B[i]);

	FWT(A,N,1);FWT(B,N,1);
	for (int i=0;i<N;i++) A[i]=1ll*A[i]*B[i]%Mod;
	FWT(A,N,-1);

	int Ans=inf;
	for (int i=0;i<N;i++) Ans=min(Ans,A[i]);

	printf("%d\n",Ans);
	return 0;
}

int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void FWT(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
			{
				int X=P[j+k],Y=P[j+k+i];
				P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
				if (opt==-1) P[j+k]=1ll*P[j+k]*inv2%Mod,P[j+k+i]=1ll*P[j+k+i]*inv2%Mod;
			}
	return;
}
```