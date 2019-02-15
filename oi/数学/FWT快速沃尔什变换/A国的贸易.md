# A国的贸易
[51nod1773]

A国是一个神奇的国家。  
这个国家有 2n 个城市，每个城市都有一个独一无二的编号 ，编号范围为0~2n-1。  
A国的神奇体现在，他们有着神奇的贸易规则。 
当两个城市u，v的编号满足calc（u，v）=1的时候，这两个城市才可以进行贸易（即有一条边相连）。  
而calc（u，v）定义为u，v按位异或的结果的二进制表示中数字1的个数。  

ex：calc（1,2）=2         ——> 01 xor 10 = 11  
       calc（100,101）=1 ——> 0110,0100 xor 0110,0101 = 1  
       calc（233,233）=0 ——> 1110,1001 xor 1110,1001 = 0  

每个城市开始时都有不同的货物存储量。  
而贸易的规则是：  
每过一天，可以交易的城市之间就会交易一次。  
在每次交易中，当前城市u中的每个货物都将使所有与当前城市u有贸易关系的城市货物量 +1 。  
请问 t 天后，每个城市会有多少货物。  
答案可能会很大，所以请对1e9+7取模。

发现每一次转移相当于是从自身和自身异或$2$的次幂的值转移过来，构造一个生成函数，由于结合律的性质，可以先把后面的生成函数做$k$次异或卷积，然后再卷上原来的，$FWT$优化。  
需要输出优化。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define RG register
#define IL inline

const int maxN=21;
const int Mod=1e9+7;
const int inf=2147483647;

int n,t,inv2;
int Val[1<<maxN];
int A[1<<maxN];

IL int Input();
IL int QPow(RG int x,RG int cnt);
void FWT(RG int *P,RG int N,RG int opt);
void Print(int x);

int main()
{
	inv2=QPow(2,Mod-2);
	n=Input();t=Input();//scanf("%d%d",&n,&t);
	for (RG int i=0;i<(1<<n);i++) Val[i]=Input();//scanf("%d",&Val[i]);
	A[0]=1;
	for (RG int i=0;i<n;i++) A[1<<i]=1;

	FWT(A,1<<n,1);FWT(Val,1<<n,1);
	for (RG int i=0;i<(1<<n);++i) A[i]=1ll*QPow(A[i],t)*Val[i]%Mod;
	FWT(A,1<<n,-1);

	for (RG int i=0;i<(1<<n);++i) Print(A[i]),putchar(' ');putchar('\n');
	return 0;
}

IL int Input()
{
	RG int x=0;RG char ch=getchar();
	while ((ch>'9')||(ch<'0')) ch=getchar();
	while ((ch>='0')&&(ch<='9')) x=(x<<3)+(x<<1)+ch-48,ch=getchar();
	return x;
}

IL int QPow(RG int x,RG int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void FWT(int *P,RG int N,RG int opt)
{
	for (RG int i=1;i<N;i<<=1)
		for (RG int j=0,l=i<<1;j<N;j+=l)
			for (RG int k=j;k<i+j;++k)
			{
				RG int X=P[k],Y=P[k+i];
				P[k]=X+Y;P[k+i]=X-Y;
				if (P[k]>=Mod) P[k]-=Mod;
				if (P[k+i]<0) P[k+i]+=Mod;
				if (opt==-1){
					P[k]=1ll*P[k]*inv2%Mod;
					P[k+i]=1ll*P[k+i]*inv2%Mod;
				}
			}
	return;
}

void Print(int x)
{
	if (x>9) Print(x/10);
	putchar('0'+x%10);
	return;
}
```