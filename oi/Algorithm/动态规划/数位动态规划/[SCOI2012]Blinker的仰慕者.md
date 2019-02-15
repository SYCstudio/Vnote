# [SCOI2012]Blinker的仰慕者
[BZOJ2757]

Blinker 有非常多的仰慕者，他给每个仰慕者一个正整数编号。而且这些编号还隐藏着特殊的意义，即编号的各位数字之积表示这名仰慕者对Blinker的重要度。 现在Blinker想知道编号介于某两个值A,B之间，且重要度为某个定值K的仰慕者编号和。 

数位 DP 。关键在于如何计算出一定位数，重要度为 K 的数之和。首先可行的数不会超过 4*10^4 个，因为只有这么多种因子。预处理 F[i][j] 和 G[i][j] 分别表示 i 位的数中重要度为 j 的数个个数和其和。然后就像普通的那样数位 DP 。  
注意 K=0 的情况，由于 0 不能作为前导 0 出现在数中，所以需要特殊处理一下，记录的时候要多开一维记录当前是否不是前导 0 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=61000;
const int maxB=21;
const int Mod=20120427;
const int inf=2147483647;

int st,Ten[maxB],F[maxB][maxN],G[maxB][maxN],sG[maxB][maxN],zF[maxB],zG[maxB];
int num,Num[maxB];
ll Pm[maxN],Wei[maxN];
map<ll,int> Mp;

void Init();
int Calc(ll N,ll K);
int dfs(int dt,int sum,ll K,bool dgr);
int dfs0(int dt,int sum,bool zero,bool dgr,bool fst);
void Plus(int &x,int y);

int main(){
	Init();
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		ll A,B,K;scanf("%lld%lld%lld",&A,&B,&K);
		printf("%d\n",(Calc(B,K)-Calc(A-1,K)+Mod)%Mod);
	}
	return 0;
}

void Init(){
	Ten[0]=1;for (int i=1;i<maxB;i++) Ten[i]=1ll*Ten[i-1]*10%Mod;
	for (int i=0;i<=9;i++){
		Pm[Mp[i]=++st]=i;F[1][st]=1;G[1][st]=i;Wei[st]=(i!=0);
	}
	for (int i=1,lstst=st;i<maxB-1;i++){
		for (int j=1;j<=lstst;j++)
			for (int k=0;k<=9;k++){
				ll t=Pm[j]*k;if (Mp[t]==0) Pm[Mp[t]=++st]=t,Wei[st]=Wei[j]+1;
				int s=Mp[t];
				Plus(F[i+1][s],F[i][j]);Plus(G[i+1][s],(G[i][j]+1ll*F[i][j]*k%Mod*Ten[i]%Mod)%Mod);
			}
		lstst=st;
	}
	for (int i=1;i<maxB;i++)
		for (int j=1;j<=st;j++){
			sG[i][j]=G[i][j];
			Plus(sG[i][j],sG[i-1][j]);Plus(zF[i],F[i][j]);Plus(zG[i],G[i][j]);
		}
	return;
}

int Calc(ll N,ll K){
	if (N==0) return 0;
	num=0;while (N) Num[++num]=N%10,N/=10;
	if (K==0) return dfs0(num,0,0,1,1);
	return (dfs(num,0,K,1)+sG[num-1][Mp[K]])%Mod;
}

int dfs(int dt,int sum,ll K,bool dgr){
	if (dt==0) return (K==1)?(sum):(0);
	if (dgr==0){
		int k=Mp[K];
		return (1ll*sum*Ten[dt]%Mod*F[dt][k]%Mod+G[dt][k])%Mod;
	}
	int ret=0;
	for (int i=1;i<=Num[dt];i++)
		if (K%i==0) Plus(ret,dfs(dt-1,(sum*10+i)%Mod,K/i,i==Num[dt]));
	return ret;
}

int dfs0(int dt,int sum,bool zero,bool dgr,bool fst){
	if (dt==0) return zero?sum:0;
	if ((dgr==0)&&(fst==0)){
		if (zero) return (1ll*sum*Ten[dt]%Mod*zF[dt]%Mod+zG[dt])%Mod;
		else return (1ll*sum*Ten[dt]%Mod*F[dt][1]%Mod+G[dt][1])%Mod;
	}
	int end=dgr?Num[dt]:9;
	int ret=0;
	for (int i=0;i<=end;i++) Plus(ret,dfs0(dt-1,(sum*10+i)%Mod,zero|!i&!fst,dgr&&(i==end),fst&&(i==0)));
	return ret;
}

void Plus(int &x,int y){
	x=x+y;if (x>=Mod) x-=Mod;return;
}
```