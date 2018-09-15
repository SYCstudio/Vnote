# Dropping tests
[POJ2967 SCU2992 ZOJ3068]

In a certain course, you take n tests. If you get ai out of bi questions correct on test i, your cumulative average is defined to be

![](https://odzkskevi.qnssl.com/3b276ec6cce278e02c8588ea450bbd22?v=1528159719)

Given your test scores and a positive integer k, determine how high you can make your cumulative average if you are allowed to drop any k of your test scores.

Suppose you take 3 tests with scores of 5/5, 0/1, and 2/6. Without dropping any tests, your cumulative average is ![](https://odzkskevi.qnssl.com/1d5abb1f890636d0a47bac88f3b1436b?v=1528159719). However, if you drop the third test, your cumulative average becomes ![](https://odzkskevi.qnssl.com/f70df6d58de94d28226a4ac887bd9425?v=1528159719).

题意：给出数组$A[i]$和$B[i]$，求删掉不超过$K$个数使得$\frac{\sum^{n} _ {i=1} A _ i}{\sum^{n} _ {i=1} B _ i}$最大

分数规划，设答案为$L$，则要求$\frac{\sum^{n} _ {i=1} A _ i}{\sum^{n} _ {i=1} B _ i}=L$，移项后得到$\sum _ {i=1}^n A[i]-L \times \sum _ {i=1}^n B[i]$，这个式子若小于$0$，则说明$L$可以更大，所以二分这个$L$，算出数值与$0$进行比较

> 目前在POJ上WA，其它OJ上AC，不知原因

```cpp
//分数规划，二分后判断函数与0的关系
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const double eps=1e-8;
const int inf=2147483647;

int n,K;
int A[maxN],B[maxN];
double D[maxN];

double Calc(double mid);

int main()
{
	while (scanf("%d%d",&n,&K)!=EOF)
	{
		if ((n==0)&&(K==0)) break;
		for (int i=1;i<=n;i++) scanf("%d",&A[i]);
		for (int i=1;i<=n;i++) scanf("%d",&B[i]);
		double L=0,R=1,Ans;
		for (int i=1;i<=n;i++) R=max(R,1.0*A[i]/1.0*B[i]);
		do
		{
			double mid=(L+R)/2.0;
			if (Calc(mid)<=eps) Ans=mid,R=mid;
			else L=mid;
		}
		while (L+eps<R);
		printf("%.0lf\n",Ans*100);
	}
	return 0;
}

double Calc(double mid)
{
	for (int i=1;i<=n;i++) D[i]=1.0*A[i]-1.0*B[i]*mid;
	sort(&D[1],&D[n+1]);
	double sum=0;
	for (int i=K+1;i<=n;i++) sum+=D[i];
	return sum;
}
```