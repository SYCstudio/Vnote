# [UNR #2]积劳成疾
[UOJ311]

经过长期的观察，稳爷爷发现假老师每天会恰好审 $k$ 道题。假设现在UOJ有 $n$ 道题要审（编号为 $1, \dots, n$），为了让审题工作更加细致，假老师会选择这样一种方式审题：  
第一天审编号为 $1, \dots, k$ 的题，  
第二天审编号为 $2, \dots, k+1$ 的题，  
……  
第 $n-k+1$ 审编号为 $n-k+1, \dots, n$ 的题。  
稳爷爷接着还发现，假老师每天审题的劳累度跟当天审的 $k$ 道题中最难的题有关。每道题都有一个难度系数，是一个介于 $1$ 到 $n$ 之间的整数。假老师对于不同难度的题有不同的劳累度，可用一组常数 $w _ 1, \dots, w _ n$ 表示。若假老师某一天审的题中难度系数的最大值为 $d$，则假老师这一天的劳累度为 $w _ d$（由于假老师对题目难度有独特的口味，$w _ d$ 并不一定是单调递减的）  
假老师 $n-k+1$ 天的审题工作总劳累度定义为每一天劳累度的乘积。  
然而作为UOJ工作人员，假老师自然不能透露任何难度信息，所以稳爷爷只好认为每道题的难度在 $1, \dots, n$ 中均匀随机，而他想知道的就是假老师总劳累度的期望值。  
显然这个期望值 $E$ 乘以 $n^n$ 一定是一个整数，所以你只需要输出 $n^n E$ 对 $998244353$ 取模的结果即可。

既然是求 $n ^ n E$ 那么相当于是求所有可能方案的劳累度之和。设 F[i][j] 表示长度为 j 的序列中最大难度系数不超过 i 的总劳累度。首先这是一个前缀和的形式，那么就有 F[i][j]=F[i-1][j] 这个转移。然后枚举这个序列中第一个难度为 i 的题目的出现位置，假设为 p ，那么对于小于 p 位置的所有题目，难度要小于 i ，对于大于 p 位置的所有题目，难度要小于等于 i ，而这一次放置在 p 位置的 i ，能够贡献所有覆盖了它的长度为 k 的区间，假设有 c 个，并且 p 把整个序列分成左右两个不相干的部分，左右的贡献单独分别计算，而跨过了 p 的贡献区间全部都是 $w _ i$ ，那么根据期望的线性性， $F[i][j]=F[i-1][p] \times F[i][j-p] \times w _ {i} ^ c$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=410;
const int Mod=998244353;
const int inf=2147483647;

int n,K;
int W[maxN],F[maxN][maxN],Pw[maxN];

int main(){
	scanf("%d%d",&n,&K);
	for (int i=1;i<=n;i++) scanf("%d",&W[i]);
	for (int i=0;i<=n;i++) F[i][0]=1;
	for (int i=1;i<=n;i++){
		Pw[0]=1;for (int j=1;j<=n;j++) Pw[j]=1ll*Pw[j-1]*W[i]%Mod;
		for (int j=1;j<=n;j++){
			F[i][j]=F[i-1][j];
			for (int p=1;p<=j;p++)
				F[i][j]=(F[i][j]+1ll*F[i-1][p-1]*Pw[max(0,min(p,j-K+1)-max(1,p-K+1)+1)]%Mod*F[i][j-p]%Mod)%Mod;
		}
	}
	printf("%d\n",F[n][n]);
	return 0;
}
```