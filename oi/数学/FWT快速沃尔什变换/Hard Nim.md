# Hard Nim
[BZOJ4589]

Claris和NanoApe在玩石子游戏，他们有n堆石子，规则如下：  
1. Claris和NanoApe两个人轮流拿石子，Claris先拿。  
2. 每次只能从一堆中取若干个，可将一堆全取走，但不可不取，拿到最后1颗石子的人获胜。 
不同的初始局面，决定了最终的获胜者，有些局面下先拿的Claris会赢，其余的局面Claris会负。  
Claris很好奇，如果这n堆石子满足每堆石子的初始数量是不超过m的质数，而且他们都会按照最优策略玩游戏，那么NanoApe能获胜的局面有多少种。  
由于答案可能很大，你只需要给出答案对10^9+7取模的值。

由$Nim$游戏的$SG$函数得知，当石子数异或和为$0$的时候满足后手必胜。那么相当于是构造一个生成函数然后求异或卷积快速幂。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50010*2;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,inv2;
int Cnt[maxN];
bool notprime[maxN];
int pcnt,P[maxN];

void Init();
int QPow(int x,int cnt);
void FWT(int *P,int N,int opt);

int main()
{
	Init();inv2=QPow(2,Mod-2);
	while (scanf("%d%d",&n,&m)!=EOF)
	{
		mem(Cnt,0);
		for (int i=1;P[i]<=m;i++) Cnt[P[i]]=1;
		int N=1;
		for (N=1;N<=m;N<<=1);
		FWT(Cnt,N,1);
		for (int i=0;i<N;i++) Cnt[i]=QPow(Cnt[i],n);
		FWT(Cnt,N,-1);

		printf("%d\n",Cnt[0]);
	}
	return 0;
}

void Init()
{
	notprime[1]=1;
	for (int i=2;i<maxN;i++)
	{
		if (notprime[i]==0) P[++pcnt]=i;
		for (int j=1;(j<=pcnt)&&(1ll*i*P[j]<maxN);j++)
		{
			notprime[i*P[j]]=1;
			if (i%P[j]==0) break;
		}
	}
	return;
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
				if (opt==-1) P[j+k]=1ll*P[j+k]*inv2%Mod,P[j+k+i]=1ll*P[j+k+i]%Mod;
			}
	return;
}
```