# LRU
[CF698C]

While creating high loaded systems one should pay a special attention to caching. This problem will be about one of the most popular caching algorithms called LRU (Least Recently Used).  
Suppose the cache may store no more than k objects. At the beginning of the workflow the cache is empty. When some object is queried we check if it is present in the cache and move it here if it's not. If there are more than k objects in the cache after this, the least recently used one should be removed. In other words, we remove the object that has the smallest time of the last query.  
Consider there are n videos being stored on the server, all of the same size. Cache can store no more than k videos and caching algorithm described above is applied. We know that any time a user enters the server he pick the video i with probability pi. The choice of the video is independent to any events before.  
The goal of this problem is to count for each of the videos the probability it will be present in the cache after $10 ^ 100$ queries.

注意到操作次数很大，那么可以看作是无限次操作。首先知道，大小为 K 的队列中最后剩下的元素，一定是 K 个不同的元素，即在无限次操作后一定是满的，因为不满的期望无限接近 0 。最后剩下的元素其实就是操作序列从后往前最后 K 个不重复的元素，那么设 F[S] 表示从后往前已经存在 S 内的元素时的期望，枚举一个 S 中存在的元素强制其最后一个出现，那么设该元素出现概率为 p ，其它 S 中的元素出现概率为 s ，则贡献为 $p+ps+ps^2+ps^3+ps^4+\dots$ ，等比数列求和后得到 $\frac{p}{1-s}$ 。那么集合大小为 K 的 S 就要计入答案。
注意特判那些概率为 0 的元素，若把它们除去后剩下的元素个数小于 K ，则 K 要与剩下元素个数取 min 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=21;
const ld eps=1e-10;
const int inf=2147483647;

int n,K;
int Cnt[1<<maxN];
ld P[1<<maxN];
ld F[1<<maxN];
ld Ans[maxN];

int main(){
	scanf("%d%d",&n,&K);int cnt=n,N=1<<n;
	for (int i=0;i<n;i++){
		scanf("%LF",&P[1<<i]);
		if (P[1<<i]<eps) --cnt;
	}
	K=min(K,cnt);
	for (int i=0;i<N;i++){
		Cnt[i]=Cnt[i>>1]+(i&1);
		P[i]=P[i&(-i)]+P[i-((i)&(-i))];
	}
	F[0]=1;
	for (int i=0;i<N;i++){
		for (int j=0;j<n;j++) if (((i>>j)&1)&&(fabs(1-P[i^(1<<j)])>eps)) F[i]=F[i]+F[i^(1<<j)]*P[1<<j]/(1-P[i^(1<<j)]);
		if (Cnt[i]==K) for (int j=0;j<n;j++) if ((i>>j)&1) Ans[j]+=F[i];
	}
	for (int i=0;i<n;i++) printf("%.15LF ",Ans[i]);return 0;
}
```