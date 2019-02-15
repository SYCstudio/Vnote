# LCS Again
[CF578D]

You are given a string S of length n with each character being one of the first m lowercase English letters.  
Calculate how many different strings T of length n composed from the first m lowercase English letters exist such that the length of LCS (longest common subsequence) between S and T is n - 1.  
Recall that LCS of two strings S and T is the longest string C such that C both in S and T as a subsequence.

给定一个长度为n,前m个字母都是小写字母的字符串S. 试计算有多少个长度为n,前m个字母为小写字母且与字符串S的LCS(最长上升子序列,Longest Common Subsequence)长度为n-1的字符串T 注:字符串S和T的LCS是指一个在S和T中都能找得到的最长子序列.

要求 LCS 长度为 n-1 ，那么也就是说在 DP 的时候要求 F[i][j] 在 min(i,j)-1 到 min(i,j) 之间。同时意味如果当前是确定 T 的第 i 位，对于不同的合法的 F ，只有 F[i-1][i],F[i][i],F[i+1][i] 是不同的。并且又可以知道这些状态只有两种取值，所以可以用 01 状态来存取。转移的时候枚举当前新加的字符是什么，还原出 F 然后求得新的状态。注意判断不合法情况。

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

int n,m;
ll F[8][maxN];
char str[maxN];

int main(){
	scanf("%d%d",&n,&m);
	scanf("%s",str+1);
	F[0][0]=1;
	for (int i=0;i<n;i++)
		for (int j=0;j<8;j++)
			if (F[j][i]){
				int f1,f2,f3;
				if (j&1) f1=max(0,i-1);else f1=max(0,i-2);
				if (j&2) f2=i;else f2=max(0,i-1);
				if (j&4) f3=i;else f3=max(0,i-1);
				for (int k=0;k<m;k++){
					int g1=f1,g2=f2,g3=f3;
					g1=max(g1,max(f1+(str[i]-'a'==k),f2));
					g2=max(max(g2,f2+(str[i+1]-'a'==k)),max(f3,g1));
					g3=max(g3,max(f3+(str[i+2]-'a'==k),g2));
					if ((g1<i-1)||(g2<i)||(g3<i)) continue;
					int key=0;
					if (g1==i) key|=1;if (g2==i+1) key|=2;if (g3==i+1) key|=4;
					F[key][i+1]+=F[j][i];
				}
			}
	printf("%lld\n",F[0][n]+F[1][n]+F[4][n]+F[5][n]);
	return 0;
}
```