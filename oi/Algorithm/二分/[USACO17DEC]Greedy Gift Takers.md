# [USACO17DEC]Greedy Gift Takers
[BZOJ5139 Luogu4090]

Farmer John's nemesis, Farmer Nhoj, has $N$ cows ($1 \leq N \leq 10^5$), conveniently numbered $1 \dots N$. They have unexpectedly turned up at Farmer John's farm, so the unfailingly polite Farmer John is attempting to give them gifts.  
To this end, Farmer John has brought out his infinite supply of gifts, and Nhoj's cows have queued up in front of him, with cow $1$ at the head of the queue and cow $N$ at the tail. Farmer John was expecting that at every timestep, the cow at the head of the queue would take a gift from Farmer John and go to the tail of the queue. However, he has just realized that Nhoj's cows are not that polite! After receiving her gift, each cow may not go to the tail of the queue, but rather may cut some number of cows at the tail, and insert herself in front of them. Specifically, cow $i$ will always cut exactly $c_i$ cows ($0 \leq c_i \leq N-1$).  
Farmer John knows that some cows might receive multiple gifts; as he has an infinite supply, this does not worry him. But he is worried that some cows might become unhappy if they do not get any gifts.  
Help Farmer John find the number of cows who never receive any gifts, no matter how many gifts are handed out.  
有 N($1≤N≤10^5$)头牛按顺序排成一列，编号从 1 到 N，1 号牛在队头，N 号牛在队尾。  
每次位于队头的牛 i 拿到一个礼物，然后插入到从队尾数$c_i$头牛之前的位置。。举个栗子： 初始队列 1,2,3,4,5 $c_1$ = 2，$c_2$ = 3，则第一次操作后的序列为 2,3,1,4,5，第二次操作后的序列为 3,2,1,4,5。重复无限次操作，求最后有几头牛拿不到礼物。

当牛 i 拿不到礼物的时候，后面的牛也是拿不到的，也就说第一个牛的位置具有可二分性。转换为判断前 i-1 个牛是否会形成死循环。处理出到达每一个位置的牛的个数，当位置 i 的牛的个数大于等于 i 的时候说明出现了循环，则后面的牛均无法拿到礼物。维护前缀和。

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
const int inf=2147483647;

int n;
int To[maxN],Cnt[maxN];

bool check(int mid);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&To[i]),To[i]=n-To[i];

	int L=1,R=n,pos=0;
	do{
		int mid=(L+R)>>1;
		if (check(mid)) pos=mid,R=mid-1;
		else L=mid+1;
	}
	while (L<=R);

	printf("%d\n",n-pos+1);return 0;
}

bool check(int mid){
	mem(Cnt,0);
	for (int i=1;i<mid;i++) Cnt[To[i]]++;
	for (int i=1,sum=0;i<mid;i++){
		sum+=Cnt[i];
		if (sum>=i) return 1;
	}
	return 0;
}
```