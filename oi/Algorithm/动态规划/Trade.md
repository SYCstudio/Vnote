# Trade
[HDU3401]

Recently, lxhgww is addicted to stock, he finds some regular patterns after a few days' study.  
He forecasts the next T days' stock market. On the i'th day, you can buy one stock with the price APi or sell one stock to get BPi.  
There are some other limits, one can buy at most ASi stocks on the i'th day and at most sell BSi stocks.  
Two trading days should have a interval of more than W days. That is to say, suppose you traded (any buy or sell stocks is regarded as a trade)on the i'th day, the next trading day must be on the (i+W+1)th day or later.  
What's more, one can own no more than MaxP stocks at any time.  
Before the first day, lxhgww already has infinitely money but no stocks, of course he wants to earn as much money as possible from the stock market. So the question comes, how much at most can he earn?

给出每一天买入的单价、上限以及卖出的单价、上限，两次操作必须相隔至少 m 天，任何时刻持有的股票数量不能超过 mxP ，求最大获利。

设 F[i][j] 表示前 i 天，当前持有 j 股的最大利润，则首先有 F[i][j]=F[i-1][j] 表示这一天不操作，则另 lst=i-m-1  F[i][j]=max(F[lst][k]-Api(j-k),F[lst][k]+Bpi(k-j)) ，单调队列优化转移。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=2020;
const int inf=1000000000;

int n,mxP,W;
int F[maxN][maxN];
int Q[maxN];

int main(){
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		scanf("%d%d%d",&n,&mxP,&W);
		for (int i=0;i<=n;i++) for (int j=0;j<=mxP;j++) F[i][j]=-inf;
		F[0][0]=0;
		for (int i=1;i<=n;i++){
			int as,bs,ap,bp;scanf("%d%d%d%d",&ap,&bp,&as,&bs);
			int lst=max(0,i-W-1);
			for (int j=0;j<=mxP;j++) F[i][j]=max(F[i][j],F[i-1][j]);
			int L=1,R=0;
			for (int j=0;j<=mxP;j++){
				while ((L<=R)&&(Q[L]<j-as)) L++;
				if (L<=R) F[i][j]=max(F[i][j],F[lst][Q[L]]+ap*Q[L]-ap*j);
				while ((L<=R)&&(F[lst][Q[R]]+ap*Q[R]<=F[lst][j]+ap*j)) R--;
				Q[++R]=j;
			}
			L=1;R=0;
			for (int j=mxP;j>=0;j--){
				while ((L<=R)&&(Q[L]>j+bs)) L++;
				if (L<=R) F[i][j]=max(F[i][j],F[lst][Q[L]]+bp*Q[L]-bp*j);
				while ((L<=R)&&(F[lst][Q[R]]+bp*Q[R]<=F[lst][j]+bp*j)) R--;
				Q[++R]=j;
			}
		}

		int Ans=0;
		for (int i=0;i<=mxP;i++) Ans=max(Ans,F[n][i]);
		printf("%d\n",Ans);
	}
	return 0;
}
```