# [LLH邀请赛]巧克力棒
[BZOJ1299]

TBL和X用巧克力棒玩游戏。每次一人可以从盒子里取出若干条巧克力棒，或是将一根取出的巧克力棒吃掉正整数长度。TBL先手两人轮流，无法操作的人输。 他们以最佳策略一共进行了10轮（每次一盒）。你能预测胜负吗？

由 Nim 游戏的结论知道，当石子数异或和为 0 的时候，先手必败。那么现在先手想让后手面对一个必败的状态。当选出的石子数满足异或和为 0 并且剩下的石子数异或和不能为 0 的时候，先手必胜，因为此时后手面对一个异或和为 0 的局面，如果后手选择操作 Nim 游戏，则必败，如果选择从原来的盒子中取出来一些，因为已经保证取出来的不能为 0 了，所以一定会导致取出来的与原来取出来的异或和不为 0 ，此时先手再操作使之为 0 ，就可以再次达到先手必胜态。  
如何达到这个情况呢，只要使得原来石子堆中所有异或和为 0 的石子都取出来了就可以了。用线性基来维护这个东西。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxBit=32;

int n;
int Base[maxBit];

bool Insert(int key);

int main(){
	int T=10;
	while (T--){
		mem(Base,0);
		int n;scanf("%d",&n);
		bool flag=0;
		for (int i=1;i<=n;i++)
		{
			int key;scanf("%d",&key);
			if (Insert(key)==0){
				flag=1;
			}
		}
		if (flag==0) printf("YES\n");
		else printf("NO\n");
	}

	return 0;
}

bool Insert(int key){
	for (int i=maxBit-1;i>=0;i--)
		if (key&(1<<i)){
			if (Base[i]==0){
				Base[i]=key;return 1;
			}
			key^=Base[i];
		}
	return 0;
}
```
