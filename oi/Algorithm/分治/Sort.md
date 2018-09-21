# Sort
[noiac32]

众所周知，排序方法有许多种。例如：简单易懂的冒泡排序，平均复杂度较优的快速排序，以及不基于比较的基数排序等等。  
现在，小 $D$ 得到了一个自然数序列 $\{a _ 1,a _ 2,\cdots,a _ n\}$。他想要对其按照从小到大的顺序进行排序（即使得每个元素均严格不大于他的后继元素）。但由于基于比较的排序算法复杂度下界已经被证明为 $\Theta (n\log _ 2n)$，所以小 $D$ 决定尝试一种全新的排序算法：翻转排序。  
在翻转排序中，小 $D$ 在每次操作中，可以选择一个区间 $[l,r]$ $(1\le l\le r\le n)$，并翻转 $a _ l,a _ {l+1},\cdots,a _ r$。即，在该次操作完后，序列将会变为 $a _ 1,a _ 2,\cdots,a _ {l-1},a _ r,a _ {r-1},\cdots,a _ {l+1},a _ l,a _ {r+1},a _ {r+2},\cdots,a _ n$。  
例如，对于序列 $[1,6,2,4,3,5]$，若选择区间 $[2,4]$ 进行翻转，则将会得到 $[1,4,2,6,3,5]$。  
定义一次操作的代价为 $r-l+1$，即翻转的区间长度。定义一个操作序列的代价为每次操作的代价之和。现在，请你帮助小 $D$ 求出一个代价足够小的操作序列（你并不一定要求出代价最小的操作序列）。

考虑如何处理 01 的序列，那么即是类似归并排序，每次合并的时候，把左边的后面的 1 连同右边前面的 0 一并翻转就可以得到解。对于任意序列，可以考虑用快速排序，每次选择一个数 mid  ，将小于等于 mid 的数看作 0 ，大于的看作 1 ，就可以套用归并排序的方法，把序列分成两部分，然后分治下去做。  
需要注意的是，为了保证快速排序部分的正确性，需要知道区间真实的 mid 值，那么二分一下区间 mid 值。由于值可能一样，为了防止可能出现不能刚好按照真实 mid 值分成两半的情况，那么在前面预处理的时候给每一个点离散化一下，使之成为一个排列。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50100;
const int inf=2147483647;

class Data
{
public:
	int key,pos;
};

int n;
int Arr[maxN],ZO[maxN];
Data D[maxN];

bool cmp(Data A,Data B);
void Solve(int l,int r);
void Merge(int l,int r);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&D[i].key),D[i].pos=i;
	sort(&D[1],&D[n+1],cmp);
	for (int i=1;i<=n;i++) Arr[D[i].pos]=i;

	Solve(1,n);

	printf("-1 -1\n");
	return 0;
}

bool cmp(Data A,Data B){
	return A.key<B.key;
}

void Solve(int l,int r){
	if (l==r) return;
	int midpos=(l+r)>>1,sz=midpos-l+1;
	int lkey=0,rkey=1e9,midnum=Arr[l];
	do{
		int limit=(lkey+rkey)>>1,cnt=0;
		for (int i=l;i<=r;i++) cnt+=(Arr[i]<=limit);
		if (cnt>=sz) midnum=limit,rkey=limit-1;
		else lkey=limit+1;
	}
	while (lkey<=rkey);
	for (int i=l;i<=r;i++) ZO[i]=Arr[i]>midnum;
	Merge(l,r);
	Solve(l,midpos);Solve(midpos+1,r);
	return;
}

void Merge(int l,int r){
	if (l==r) return;
	int mid=(l+r)>>1;
	Merge(l,mid);Merge(mid+1,r);
	int p1=mid,p2=mid+1;
	if (ZO[p1]>ZO[p2]){
		while ((p1>l)&&(ZO[p1-1]==1)) p1--;
		while ((p2<r)&&(ZO[p2+1]==0)) p2++;
		printf("%d %d\n",p1,p2);
		for (int i=p1,j=p2;i<j;i++,j--) swap(ZO[i],ZO[j]),swap(Arr[i],Arr[j]);
	}
	return;
}
```