# Bob and Alice are playing numbers
[Ifrog1028]

Bob and his girl friend are playing game together.This game is like this:  
There are n  numbers.  
If op = 1,Bob wants to find two numbers ai and aj,that ai & ajwill become maximum value.  
If op = 2,Bob wants to find two numbers ai and aj,that ai ^ ajwill become maximum value.  
If op = 3,Bob wants to find two numbers ai and aj,that ai | aj will become maximum value.  
Notice:& for bitwise AND. (4 & 2) is 0, (4 & 5) is 4.^ for bitwise XOR. (4 ^ 2) is 6, (4 ^ 5) is 1.| for bitwise OR . (4 | 2) is 6, (4 | 5) is 5.

对每一种运算分别自己与自己FWT计算次数，然后减去自己与自己重复算的，倒着枚举找到最大值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxM=1010000*2;
const int inf=2147483647;

int n,opt;
int Cnt[maxM],A[maxM],Num[maxN];

void FWTAnd(int *P,int N,int opt);
void FWTOr(int *P,int N,int opt);
void FWTXor(int *P,int N,int opt);

int main()
{
	int TTT;scanf("%d",&TTT);
	for (int ti=1;ti<=TTT;ti++)
	{
		mem(Cnt,0);mem(A,0);
		scanf("%d%d",&n,&opt);
		int mx=0;
		for (int i=1;i<=n;i++)
		{
			scanf("%d",&Num[i]);
			Cnt[Num[i]]++;mx=max(mx,Num[i]);
		}
		int N=0;
		for (N=1;N<=mx;N<<=1);
		for (int i=0;i<N;i++) A[i]=Cnt[i];
		if (opt==1){
			FWTAnd(A,N,1);
			for (int i=0;i<N;i++) A[i]=A[i]*A[i];
			FWTAnd(A,N,-1);
			for (int i=1;i<=n;i++) A[Num[i]&Num[i]]--;
		}
		if (opt==2){
			FWTOr(A,N,1);
			for (int i=0;i<N;i++) A[i]=A[i]*A[i];
			FWTOr(A,N,-1);
			for (int i=1;i<=n;i++) A[Num[i]|Num[i]]--;
		}
		if (opt==3){
			FWTXor(A,N,1);
			for (int i=0;i<N;i++) A[i]=A[i]*A[i];
			FWTXor(A,N,-1);
			for (int i=1;i<=n;i++) A[Num[i]^Num[i]]--;
		}

		for (int i=N;i>=0;i--)
			if (A[i]){
				printf("Case #%d: %d\n",ti,i);break;
			}
	}

	return 0;
}

void FWTAnd(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
				P[j+k]=P[j+k]+P[j+k+i]*opt;
	return;
}

void FWTOr(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
				P[j+k+i]=P[j+k+i]+P[j+k]*opt;
	return;
}

void FWTXor(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
			{
				int X=P[j+k],Y=P[j+k+i];
				P[j+k]=X+Y;P[j+k+i]=X-Y;
				if (opt==-1) P[j+k]/=2,P[j+k+i]/=2;
			}
	return;
}
```