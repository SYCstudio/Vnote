# xylophone
[IOI2018试机赛T2]

有一个$1-n$排列，保证$1$在$n$的左边。你每次可以询问交互库一个区间，交互库会告诉你这个区间内的最大值减去最小值的结果。你需要在不超过$10^4$次询问内还原出这个排列。

只要确定相对数值关系即可确定最终的排列。  
不妨先假定第一个元素是 1 ，且第一个元素小于第二个元素。那么每次询问相邻两个和三个元素，对返回的结果以及当前前两个数的大小关系进行讨论即可得到底萨个数。最后再扫描整个序列，调整其为 [1..n] 的排列且 1 在 n 左边。

```cpp
#include"xylophone.h"
#include<cstdio>
#include<algorithm>
#include<cstdlib>
#include<cstring>
#include<iostream>
using namespace std;
const int maxN=5010;
void find_permutation(int n,int *ans){
	ans[1]=1;if (n==1) return;
	int a=query(1,2),mn=1;ans[2]=ans[1]+a;mn=min(mn,ans[2]);
	for (int i=3;i<=n;i++){
		int r1=max(ans[i-2],ans[i-1])-min(ans[i-2],ans[i-1]),r2=query(i-1,i),r3=query(i-2,i);
		if (ans[i-2]<ans[i-1]){
			if (r1+r2==r3) ans[i]=ans[i-1]+r2;
			else ans[i]=ans[i-1]-r2;
		}
		else{
			if (r1+r2==r3) ans[i]=ans[i-1]-r2;
			else ans[i]=ans[i-1]+r2;
		}
		mn=min(mn,ans[i]);
	}
	int p1,p2;
	for (int i=1;i<=n;i++){
		ans[i]=ans[i]+1-mn;
		if (ans[i]==1) p1=i;
		if (ans[i]==n) p2=i;
	}
	if (p1>p2) for (int i=1;i<=n;i++) ans[i]=n-ans[i]+1;
	return;
}
```