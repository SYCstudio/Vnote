# [HAOI2007]反素数ant
[BZOJ1053 Luogu1463]

对于任何正整数x，其约数的个数记作g(x)。例如g(1)=1、g(6)=4。   
如果某个正整数x满足：g(x)>g(i) 0<i<x，则称x为反质数。例如，整数1，2，4，6等都是反质数。   
现在给定一个数N，你能求出不超过N的最大的反质数么？

一个数的约数个数为所有质因子出现次数+1的乘积。考虑到在题目范围的值域内，把一个数分解成不超过$30$个，并且越小的数出现次数越多。注意到反素数要求大素数的出现次数不能超过小素数，所以可以直接搜索。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int pricnt=12;
const int Prime[]={2,3,5,7,11,13,17,19,23,29,31,37,41};

int n;
int mx=0,ans=0;
int Cnt[pricnt+1];

void dfs(int depth,int sum,int key);

int main(){
	scanf("%d",&n);
	dfs(0,1,1);
	printf("%d\n",ans);
	return 0;
}

void dfs(int depth,int sum,int key){
	if (depth>pricnt) return;
	if ((sum>mx)||((sum==mx)&&(key<ans))){
		ans=key;mx=sum;
	}
	int ret=1;
	while ((1ll*key*Prime[depth]<=n)&&((depth==0)||(Cnt[depth]<Cnt[depth-1]))){
		key=key*Prime[depth];Cnt[depth]++;
		dfs(depth+1,sum*(Cnt[depth]+1),key);
	}
	Cnt[depth]=0;
	return;
}
```